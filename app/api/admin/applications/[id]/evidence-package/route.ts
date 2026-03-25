import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { get } from '@vercel/blob'
import JSZip from 'jszip'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // In production, add admin authentication here
  // const session = await getAdminSession(request)
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    // Fetch application record
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Ensure application is submitted
    if (application.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Evidence package only available for submitted applications' },
        { status: 400 }
      )
    }

    // Fetch audit trail
    const { data: auditTrail, error: auditError } = await supabase
      .from('application_audit_trail')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: true })

    if (auditError) {
      console.error('Error fetching audit trail:', auditError)
    }

    // Fetch documents list
    const { data: documents, error: docsError } = await supabase
      .from('application_documents')
      .select('*')
      .eq('application_id', id)

    if (docsError) {
      console.error('Error fetching documents:', docsError)
    }

    // Create ZIP file
    const zip = new JSZip()

    // Add application metadata as JSON
    const metadata = {
      applicationId: application.id,
      status: application.status,
      practiceName: application.practice_name,
      email: application.email,
      phone: application.phone,
      submittedAt: application.submitted_at,
      lockedAt: application.locked_at,
      agreementVersion: application.agreement_version,
      signatureType: application.signature_type,
      signerName: application.printed_name,
      signerTitle: application.signer_title,
      signatureDate: application.signature_date,
      createdAt: application.created_at,
      updatedAt: application.updated_at,
    }
    zip.file('metadata.json', JSON.stringify(metadata, null, 2))

    // Add full application data (sanitized)
    const fullApplicationData = { ...application }
    delete fullApplicationData.signature_data // Don't include raw signature data in JSON
    zip.file('application-data.json', JSON.stringify(fullApplicationData, null, 2))

    // Add audit trail as JSON
    const auditTrailFormatted = (auditTrail || []).map(entry => ({
      id: entry.id,
      action: entry.action,
      actionDetails: entry.action_details,
      ipAddress: entry.ip_address,
      userAgent: entry.user_agent,
      timestamp: entry.created_at,
    }))
    zip.file('audit-trail.json', JSON.stringify(auditTrailFormatted, null, 2))

    // Add audit trail as human-readable text
    let auditTrailText = `AUDIT TRAIL FOR APPLICATION ${id}\n`
    auditTrailText += `${'='.repeat(60)}\n\n`
    auditTrailText += `Generated: ${new Date().toISOString()}\n\n`
    
    for (const entry of auditTrailFormatted) {
      auditTrailText += `[${new Date(entry.timestamp).toLocaleString()}]\n`
      auditTrailText += `Action: ${entry.action.replace(/_/g, ' ').toUpperCase()}\n`
      auditTrailText += `IP Address: ${entry.ipAddress}\n`
      auditTrailText += `User Agent: ${entry.userAgent}\n`
      if (entry.actionDetails) {
        auditTrailText += `Details: ${JSON.stringify(entry.actionDetails, null, 2)}\n`
      }
      auditTrailText += `\n${'-'.repeat(40)}\n\n`
    }
    zip.file('audit-trail.txt', auditTrailText)

    // Fetch and add documents from blob storage
    const docsFolder = zip.folder('documents')
    
    if (documents && docsFolder) {
      for (const doc of documents) {
        try {
          const blobResult = await get(doc.blob_path, { access: 'private' })
          if (blobResult && blobResult.stream) {
            // Convert stream to buffer
            const reader = blobResult.stream.getReader()
            const chunks: Uint8Array[] = []
            
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              if (value) chunks.push(value)
            }
            
            const buffer = Buffer.concat(chunks)
            
            // Determine filename
            const extension = doc.content_type?.split('/')[1] || 'pdf'
            const filename = doc.original_filename || `${doc.document_type}.${extension}`
            
            docsFolder.file(filename, buffer)
          }
        } catch (err) {
          console.error(`Error fetching document ${doc.id}:`, err)
          // Add error note for this document
          docsFolder.file(`${doc.document_type}_ERROR.txt`, 
            `Failed to retrieve document: ${doc.blob_path}\nError: ${err}`
          )
        }
      }
    }

    // Add documents manifest
    const documentsManifest = (documents || []).map(doc => ({
      id: doc.id,
      type: doc.document_type,
      originalFilename: doc.original_filename,
      blobPath: doc.blob_path,
      contentType: doc.content_type,
      fileSize: doc.file_size_bytes,
      uploadedAt: doc.created_at,
    }))
    zip.file('documents-manifest.json', JSON.stringify(documentsManifest, null, 2))

    // Add README
    const readme = `MIALAB APPLICATION EVIDENCE PACKAGE
====================================

Application ID: ${id}
Practice Name: ${application.practice_name}
Submitted: ${application.submitted_at}
Generated: ${new Date().toISOString()}

CONTENTS:
---------
- metadata.json          : Key application metadata
- application-data.json  : Complete application form data
- audit-trail.json       : Machine-readable audit trail
- audit-trail.txt        : Human-readable audit trail
- documents-manifest.json: List of all attached documents
- documents/             : Folder containing all uploaded documents
  - Signed application PDF
  - Resale certificate (if provided)
  - Any other uploaded documents

LEGAL NOTICE:
-------------
This evidence package contains the complete, unmodified record of the 
application submitted by ${application.printed_name} (${application.signer_title}) 
on behalf of ${application.practice_name}.

The application was electronically signed on ${application.signature_date} and 
has been locked from modification since ${application.locked_at}.

All timestamps are in UTC unless otherwise noted.

Agreement Version: ${application.agreement_version}
`
    zip.file('README.txt', readme)

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP file
    const sanitizedPracticeName = application.practice_name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30)
    const filename = `mialab_evidence_${sanitizedPracticeName}_${id.slice(0, 8)}.zip`

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Error generating evidence package:', error)
    return NextResponse.json(
      { error: 'Failed to generate evidence package' },
      { status: 500 }
    )
  }
}
