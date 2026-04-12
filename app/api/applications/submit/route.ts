import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { put, get } from '@vercel/blob'
import { generateApplicationPDF } from '@/lib/pdf-generator'
import { AGREEMENT_VERSION } from '@/lib/agreement-text'
import { sendEmail, getMialabInternalEmail } from '@/lib/email-service'
import { 
  generateCustomerConfirmationEmail, 
  generateInternalNotificationEmail,
  EMAIL_SUBJECTS 
} from '@/lib/email-templates'
import type { ApplicationFormData } from '@/lib/form-types'

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SubmissionPayload {
  formData: ApplicationFormData
  signatureType: 'typed' | 'drawn'
  resaleCertificatePath?: string
  lang?: 'en' | 'es'
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get client info for audit trail
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const payload: SubmissionPayload = await request.json()
    const { formData, signatureType, resaleCertificatePath, lang = 'en' } = payload

    // Validate required fields
    if (!formData.printedName || !formData.signatureData || !formData.agreeToTerms) {
      return NextResponse.json(
        { error: 'Missing required signature fields' },
        { status: 400 }
      )
    }

    const submittedAt = new Date().toISOString()
    const submittedAtFormatted = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    // 1. Create the application record (draft status initially)
    const { data: application, error: insertError } = await supabase
      .from('applications')
      .insert({
        status: 'draft',
        practice_name: formData.practiceName,
        dba_name: formData.dbaName || null,
        doctor_owner_name: formData.doctorOwnerName,
        primary_contact_name: formData.primaryContactName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || null,
        business_type: formData.businessType,
        years_in_business: formData.yearsInBusiness,
        is_owner_principal: formData.isOwnerPrincipal,
        billing_address_1: formData.billingAddress1,
        billing_address_2: formData.billingAddress2 || null,
        billing_city: formData.billingCity,
        billing_state: formData.billingState,
        billing_zip: formData.billingZip,
        ap_contact_name: formData.apContactName,
        ap_email: formData.apEmail,
        monthly_statement_email_preference: formData.monthlyStatementEmailPreference,
        shipping_same_as_billing: formData.shippingSameAsBilling,
        shipping_address_1: formData.shippingSameAsBilling ? null : formData.shippingAddress1,
        shipping_address_2: formData.shippingSameAsBilling ? null : formData.shippingAddress2,
        shipping_city: formData.shippingSameAsBilling ? null : formData.shippingCity,
        shipping_state: formData.shippingSameAsBilling ? null : formData.shippingState,
        shipping_zip: formData.shippingSameAsBilling ? null : formData.shippingZip,
        tax_id: formData.taxId,
        number_of_locations: formData.numberOfLocations,
        monthly_lab_volume: formData.monthlyLabVolume,
        weekly_exams: formData.weeklyExams,
        edge_lenses_in_house: formData.edgeLensesInHouse,
        lab_orders_manager: formData.labOrdersManager,
        lab_orders_contact_name: formData.labOrdersContactName || null,
        lab_orders_contact_email: formData.labOrdersContactEmail || null,
        plan_to_begin_sending: formData.planToBeginSending,
        main_reason: formData.mainReason,
        ordering_method: formData.orderingMethod,
        other_ordering_method: formData.otherOrderingMethod || null,
        has_resale_certificate: formData.hasResaleCertificate,
        resale_certificate_blob_path: resaleCertificatePath || null,
        apply_for_credit: formData.applyForCredit,
        requested_credit_amount: formData.requestedCreditAmount || null,
        payment_method: formData.paymentMethod,
        certify_true_accurate: formData.certifyTrueAccurate,
        authorize_credit_check: formData.authorizeCreditCheck,
        acknowledge_processing_fee: formData.acknowledgeProcessingFee,
        agree_to_terms: formData.agreeToTerms,
        signature_type: signatureType,
        signature_data: formData.signatureData,
        printed_name: formData.printedName,
        signer_title: formData.title,
        signature_date: formData.signatureDate,
        agreement_version: AGREEMENT_VERSION,
        created_at: submittedAt,
        updated_at: submittedAt,
      })
      .select()
      .single()

    if (insertError || !application) {
      console.error('Failed to create application:', insertError)
      return NextResponse.json(
        { error: 'Failed to create application record' },
        { status: 500 }
      )
    }

    const applicationId = application.id

    // 1b. Try to persist additional locations data (requires DB columns —
    //     non-fatal if the columns don't exist yet; data is in the PDF).
    if (formData.hasMultipleLocations || formData.additionalLocations?.length) {
      const { error: mlError } = await supabase
        .from('applications')
        .update({
          has_multiple_locations: formData.hasMultipleLocations || null,
          additional_locations: formData.additionalLocations?.length
            ? formData.additionalLocations
            : null,
        })
        .eq('id', applicationId)
      if (mlError) {
        console.log(
          `[submit:${applicationId}] additional_locations not saved to DB (columns may not exist yet):`,
          mlError.message
        )
      }
    }

    // 2. Log draft creation in audit trail
    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'draft_created',
      action_details: {
        email: formData.email,
        practice_name: formData.practiceName,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // 3. Generate PDF and upload to Blob — isolated so any failure here
    //    does NOT prevent emails from sending.
    let pdfBlobPathname: string | null = null
    let pdfAttachment: { content: string; filename: string; type: string } | null = null
    let customerPdfAttachment: { content: string; filename: string; type: string } | null = null

    try {
      console.log(`[submit:${applicationId}] Generating PDF...`)
      const pdfBlob = await generateApplicationPDF({
        formData,
        applicationId,
        signatureType,
        submittedAt: submittedAtFormatted,
        lang,
      })
      const pdfSizeKB = Math.round(pdfBlob.size / 1024)
      console.log(`[submit:${applicationId}] PDF generated OK — size: ${pdfSizeKB}KB (${(pdfSizeKB / 1024).toFixed(2)}MB)`)

      // 4. Upload PDF to Blob storage
      const pdfPath = `applications/${applicationId}/signed-application-${applicationId}.pdf`
      const pdfUpload = await put(pdfPath, pdfBlob, {
        access: 'private',
        contentType: 'application/pdf',
      })
      pdfBlobPathname = pdfUpload.pathname
      console.log(`[submit:${applicationId}] PDF uploaded to blob: ${pdfBlobPathname}`)

      // Prepare base64 attachment for internal email only.
      // Threshold: 7MB — well under SendGrid's 30MB limit but safe for serverless.
      const PDF_ATTACH_THRESHOLD_KB = 7 * 1024
      if (pdfSizeKB <= PDF_ATTACH_THRESHOLD_KB) {
        const pdfArrayBuffer = await pdfBlob.arrayBuffer()
        const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64')
        pdfAttachment = {
          content: pdfBase64,
          filename: `mialab-application-${applicationId.slice(0, 8)}.pdf`,
          type: 'application/pdf',
        }
        customerPdfAttachment = {
          content: pdfBase64,
          filename: 'Mialab-Application.pdf',
          type: 'application/pdf',
        }
        console.log(`[submit:${applicationId}] PDF attachment prepared (${pdfSizeKB}KB — within threshold)`)
      } else {
        console.warn(`[submit:${applicationId}] PDF size ${pdfSizeKB}KB exceeds ${PDF_ATTACH_THRESHOLD_KB}KB threshold — internal email will include a link instead of attachment`)
      }

      // 5. Record PDF document
      await supabase.from('application_documents').insert({
        application_id: applicationId,
        document_type: 'signed_application_pdf',
        original_filename: `signed-application-${applicationId}.pdf`,
        blob_path: pdfBlobPathname,
        content_type: 'application/pdf',
        file_size_bytes: pdfBlob.size,
      })
    } catch (pdfError) {
      console.error(`[submit:${applicationId}] PDF generation/upload failed — emails will send without attachment:`, pdfError)
    }

    // 6. If resale certificate was uploaded, link it
    if (resaleCertificatePath) {
      await supabase.from('application_documents').insert({
        application_id: applicationId,
        document_type: 'resale_certificate',
        original_filename: formData.resaleCertificateFileName,
        blob_path: resaleCertificatePath,
        content_type: 'application/pdf',
      })
    }

    // 7. Log agreement acceptance
    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'agreement_accepted',
      action_details: {
        agreement_version: AGREEMENT_VERSION,
        certify_true_accurate: formData.certifyTrueAccurate,
        authorize_credit_check: formData.authorizeCreditCheck,
        acknowledge_processing_fee: formData.acknowledgeProcessingFee,
        agree_to_terms: formData.agreeToTerms,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // 8. Log signature completion
    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'signature_completed',
      action_details: {
        signature_type: signatureType,
        printed_name: formData.printedName,
        title: formData.title,
        signature_date: formData.signatureDate,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // 9. Update application status to submitted and lock it
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'submitted',
        signed_pdf_blob_path: pdfBlobPathname,
        submitted_at: submittedAt,
        locked_at: submittedAt,
        updated_at: submittedAt,
      })
      .eq('id', applicationId)

    if (updateError) {
      console.error(`[submit:${applicationId}] Failed to update application status:`, updateError)
      return NextResponse.json(
        { error: 'Failed to finalize application' },
        { status: 500 }
      )
    }

    // 10. Log final submission
    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'application_submitted',
      action_details: {
        processing_time_ms: Date.now() - startTime,
        pdf_path: pdfBlobPathname,
        pdf_attached_to_email: !!pdfAttachment,
        locked: true,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // 11. Send confirmation emails — always runs, PDF attachment is optional
    console.log(`[submit:${applicationId}] Sending emails. PDF attachment for internal: ${pdfAttachment ? 'yes' : 'no'}`)
    console.log(`[submit:${applicationId}] SENDGRID_API_KEY present: ${!!process.env.SENDGRID_API_KEY}`)
    console.log(`[submit:${applicationId}] MAIL_FROM: ${process.env.MAIL_FROM || 'cs@mialab.com (default)'}`)
    console.log(`[submit:${applicationId}] MAIL_TO_INTERNAL: ${process.env.MAIL_TO_INTERNAL || 'michael@mialab.com (default)'}`)

    const internalAttachments = pdfAttachment ? [pdfAttachment] : undefined
    const customerAttachments = customerPdfAttachment ? [customerPdfAttachment] : undefined

    // 11a. Customer confirmation — PDF attached
    const customerEmailHtml = generateCustomerConfirmationEmail({
      primaryContactName: formData.primaryContactName,
      lang,
    })

    console.log(`[submit:${applicationId}] Sending customer email to: ${formData.email} (attachment: ${customerAttachments ? 'Mialab-Application.pdf' : 'none — PDF generation failed'})`)
    if (!customerAttachments) {
      console.error(`[submit:${applicationId}] WARNING: customer email sending without PDF attachment because PDF generation failed`)
    }
    const customerEmailResult = await sendEmail(
      formData.email,
      lang === 'es' ? EMAIL_SUBJECTS.customerConfirmationEs : EMAIL_SUBJECTS.customerConfirmation,
      customerEmailHtml,
      customerAttachments
    )
    console.log(`[submit:${applicationId}] Customer email result: success=${customerEmailResult.success} messageId=${customerEmailResult.messageId} error=${customerEmailResult.error ?? 'none'}`)

    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'email_sent',
      action_details: {
        email_type: 'customer_confirmation',
        recipient: formData.email,
        subject: lang === 'es' ? EMAIL_SUBJECTS.customerConfirmationEs : EMAIL_SUBJECTS.customerConfirmation,
        success: customerEmailResult.success,
        message_id: customerEmailResult.messageId,
        error: customerEmailResult.error,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    // 11b. Internal notification — PDF attached
    const internalEmailHtml = generateInternalNotificationEmail({
      applicationId,
      submissionDate: submittedAtFormatted,
      formData,
      signatureType,
      resaleCertificateUploaded: !!resaleCertificatePath,
    })

    const internalRecipient = getMialabInternalEmail()
    console.log(`[submit:${applicationId}] Sending internal email to: ${internalRecipient} (attachment: ${internalAttachments ? 'pdf' : 'none'})`)
    const internalEmailResult = await sendEmail(
      internalRecipient,
      EMAIL_SUBJECTS.internalNotification,
      internalEmailHtml,
      internalAttachments
    )
    console.log(`[submit:${applicationId}] Internal email result: success=${internalEmailResult.success} messageId=${internalEmailResult.messageId} error=${internalEmailResult.error ?? 'none'}`)

    await supabase.from('application_audit_trail').insert({
      application_id: applicationId,
      action: 'email_sent',
      action_details: {
        email_type: 'internal_notification',
        recipient: internalRecipient,
        subject: EMAIL_SUBJECTS.internalNotification,
        success: internalEmailResult.success,
        message_id: internalEmailResult.messageId,
        error: internalEmailResult.error,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (!customerEmailResult.success) {
      console.error(`[submit:${applicationId}] Customer email FAILED: ${customerEmailResult.error}`)
    }
    if (!internalEmailResult.success) {
      console.error(`[submit:${applicationId}] Internal email FAILED: ${internalEmailResult.error}`)
    }

    return NextResponse.json({
      success: true,
      applicationId,
      submittedAt,
      message: 'Application submitted successfully',
      emailsSent: {
        customer: customerEmailResult.success,
        internal: internalEmailResult.success,
      },
    })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
