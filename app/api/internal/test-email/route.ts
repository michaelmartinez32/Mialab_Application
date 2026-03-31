import { NextResponse } from 'next/server'
import { generateApplicationPDF } from '@/lib/pdf-generator'
import { sendEmail, getMialabInternalEmail } from '@/lib/email-service'
import { generateInternalNotificationEmail, EMAIL_SUBJECTS } from '@/lib/email-templates'
import type { ApplicationFormData } from '@/lib/form-types'

const TEST_FORM_DATA: ApplicationFormData = {
  practiceName: '[TEST] Sunshine Eye Care Associates',
  dbaName: 'Sunshine Optical',
  doctorOwnerName: 'Dr. Maria Santos, O.D.',
  primaryContactName: 'James Rivera',
  email: 'test@sunshineeye.com',
  phone: '(305) 555-0182',
  website: 'www.sunshineeye.com',
  businessType: 'Private Practice',
  yearsInBusiness: '8',
  isOwnerPrincipal: 'Yes',

  billingAddress1: '4120 Coral Way',
  billingAddress2: 'Suite 201',
  billingCity: 'Miami',
  billingState: 'FL',
  billingZip: '33146',
  apContactName: 'Carmen Ortega',
  apEmail: 'billing@sunshineeye.com',

  shippingSameAsBilling: true,
  shippingAddress1: '',
  shippingAddress2: '',
  shippingCity: '',
  shippingState: '',
  shippingZip: '',

  taxId: '59-1234567',
  numberOfLocations: '2',
  monthlyLabVolume: '$8,000 – $15,000',
  weeklyExams: '60–80',
  edgeLensesInHouse: 'No',
  labOrdersManager: 'Staff',
  labOrdersContactName: 'James Rivera',
  labOrdersContactEmail: 'orders@sunshineeye.com',
  planToBeginSending: 'Within 30 days',
  mainReason: 'Better turnaround time and pricing',

  orderingMethod: 'Mialab Link Portal',
  otherOrderingMethod: '',

  hasResaleCertificate: 'Yes',
  resaleCertificateFile: null,
  resaleCertificateFileName: 'resale-cert.pdf',

  applyForCredit: 'Yes',
  requestedCreditAmount: '5000',

  paymentMethod: 'Net 30',
  billingFrequency: 'Monthly',
  cardholderName: '',
  cardNumber: '',
  cardExpiration: '',
  cardCvv: '',
  cardBillingZip: '',

  certifyTrueAccurate: true,
  authorizeCreditCheck: true,
  acknowledgeProcessingFee: true,
  agreeToTerms: true,

  signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  printedName: 'Dr. Maria Santos',
  title: 'Owner / O.D.',
  signatureDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }),
}

export async function POST() {
  try {
    const testApplicationId = `TEST-${Date.now()}`
    const submittedAt = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    })

    // Generate the real PDF using the real generator — same as production flow
    const pdfBlob = await generateApplicationPDF({
      formData: TEST_FORM_DATA,
      applicationId: testApplicationId,
      signatureType: 'typed',
      submittedAt,
    })
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer())
    const pdfBase64 = pdfBuffer.toString('base64')

    // Build the internal notification email using the real template
    const emailHtml = generateInternalNotificationEmail(
      TEST_FORM_DATA,
      testApplicationId,
      submittedAt,
      'typed'
    )

    // Send only to internal address — no customer email, no DB write
    const internalEmail = getMialabInternalEmail()
    const result = await sendEmail(
      internalEmail,
      `[INTERNAL TEST] ${EMAIL_SUBJECTS.internal}`,
      emailHtml,
      [{
        content: pdfBase64,
        filename: `test-application-${testApplicationId}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
      }]
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sentTo: internalEmail,
      applicationId: testApplicationId,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('[internal/test-email] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Test email failed' },
      { status: 500 }
    )
  }
}
