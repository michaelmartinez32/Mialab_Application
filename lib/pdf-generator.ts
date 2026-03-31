import { jsPDF } from 'jspdf'
import type { ApplicationFormData } from './form-types'
import { agreementText, acknowledgmentLabels, AGREEMENT_VERSION } from './agreement-text'

interface PDFGeneratorOptions {
  formData: ApplicationFormData
  applicationId: string
  signatureType: 'typed' | 'drawn'
  submittedAt: string
}

export async function generateApplicationPDF(options: PDFGeneratorOptions): Promise<Blob> {
  const { formData, applicationId, signatureType, submittedAt } = options
  const doc = new jsPDF()

  // ── PAGE GEOMETRY ───────────────────────────────────────────────────────────
  const PW = doc.internal.pageSize.getWidth()   // 210mm A4
  const PH = doc.internal.pageSize.getHeight()  // 297mm A4
  const ML = 10                // left/right margin
  const CW = PW - ML * 2       // 190mm usable width
  const GAP = 4                // gap between dual columns
  const HALF = (CW - GAP) / 2  // ~93mm per column
  const RC = ML + HALF + GAP   // right column x

  // Label widths (label sits left of value within each column)
  const LW_FULL = 44   // for full-width rows
  const LW_HALF = 33   // for dual-column rows

  // Vertical rhythm
  const RH = 4.5          // standard row height (mm)
  const FLOOR = PH - 9   // don't render below this (footer zone)

  let y = 10

  // ── OVERFLOW GUARD ──────────────────────────────────────────────────────────
  const ensureSpace = (needed: number) => {
    if (y + needed > FLOOR) {
      doc.addPage()
      y = 10
    }
  }

  // ── SECTION HEADER ──────────────────────────────────────────────────────────
  const sectionHeader = (title: string) => {
    ensureSpace(10)
    y += 2.5
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 0, 0)
    doc.text(title, ML, y)
    y += 1.8
    doc.setDrawColor(180, 0, 0)
    doc.setLineWidth(0.2)
    doc.line(ML, y, ML + CW, y)
    y += 2.5
    doc.setTextColor(20, 20, 20)
  }

  // ── FIELD RENDERERS ─────────────────────────────────────────────────────────
  // Draws one label+value pair; returns 1 if value wrapped to a second line
  const renderPair = (
    label: string,
    value: string,
    x: number,
    labelW: number,
    valueW: number,
    fy: number
  ): number => {
    const v = value || '—'
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(115, 115, 115)
    doc.text(label, x, fy)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 20, 20)
    const lines = doc.splitTextToSize(v, valueW)
    doc.text(lines[0] || '', x + labelW, fy)
    if (lines.length > 1) {
      doc.text(lines[1], x + labelW, fy + 3.2)
      return 1
    }
    return 0
  }

  // Two label+value pairs on one row
  const dualRow = (lLabel: string, lValue: string, rLabel: string, rValue: string) => {
    doc.setFontSize(7.5)
    const vW = HALF - LW_HALF - 1
    const lWrap = doc.splitTextToSize(lValue || '—', vW).length > 1
    const rWrap = doc.splitTextToSize(rValue || '—', vW).length > 1
    const extra = (lWrap || rWrap) ? 1 : 0
    const h = RH + extra * 3.2
    ensureSpace(h)
    renderPair(lLabel, lValue, ML, LW_HALF, vW, y)
    renderPair(rLabel, rValue, RC, LW_HALF, vW, y)
    y += h
  }

  // Single full-width field
  const fullRow = (label: string, value: string) => {
    const v = value || '—'
    doc.setFontSize(7.5)
    const vW = CW - LW_FULL - 1
    const lines = doc.splitTextToSize(v, vW)
    const h = Math.max(RH, lines.length * 3.5)
    ensureSpace(h)
    renderPair(label, v, ML, LW_FULL, vW, y)
    y += h
  }

  // ── HEADER: LOGO + TITLE + META ─────────────────────────────────────────────
  // Logo: MIALAB-LOGO-WHITEBACK.jpg — white background JPEG, no transparency issues
  // Display height 10mm, width auto from aspect ratio, capped at 45mm max
  const LOGO_H = 10
  const LOGO_W_MAX = 45
  let LOGO_W = 30 // default; recalculated from real image aspect ratio below

  // Same logo asset and loading approach as Quick Send (v0-sales-tool-quick-send).
  // ASSET: public/mialab-logo-pdf.png — pre-resized to 480×258px (49 KB, ~0.47 MB decoded).
  //   The original mialab-logo.png is 6954×3732px and decodes to ~99 MB, which crashes
  //   Vercel serverless. Quick Send solved this by pre-resizing; we use the same file.
  // METHOD: same multi-candidate fs.readFileSync approach used in Quick Send's
  //   loadHeaderImageBuffer() — guards against path-resolution differences in compiled bundles.
  let logoBase64: string | null = null
  {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp')

    // Multi-candidate paths — mirrors Quick Send's loadHeaderImageBuffer()
    const candidates = [
      path.join(process.cwd(), 'public', 'mialab-logo-pdf.png'),
      path.join(__dirname, '..', '..', 'public', 'mialab-logo-pdf.png'),
      path.join(__dirname, '..', 'public', 'mialab-logo-pdf.png'),
    ]

    let buf: Buffer | null = null
    for (const p of candidates) {
      const exists = fs.existsSync(p)
      console.log(`[PDF] checking: ${p} | exists: ${exists}`)
      if (exists) {
        buf = fs.readFileSync(p)
        console.log(`[PDF] loaded mialab-logo-pdf.png from: ${p} | bytes: ${buf.length}`)
        break
      }
    }

    if (buf) {
      const meta = await sharp(buf).metadata()
      console.log(`[PDF] logo format: ${meta.format} | dimensions: ${meta.width}x${meta.height}`)

      // mialab-logo-pdf.png is 480×258px, aspect 1.860:1
      // At LOGO_H=10mm, width = 10 × 1.860 = 18.6mm (well within LOGO_W_MAX=45mm)
      if (meta.width && meta.height) {
        LOGO_W = Math.min(Math.round((meta.width / meta.height) * LOGO_H * 10) / 10, LOGO_W_MAX)
      }
      const targetH = Math.round(LOGO_H * (96 / 25.4))
      const targetW = Math.round(LOGO_W * (96 / 25.4))
      const resized: Buffer = await sharp(buf)
        .resize(targetW, targetH, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()
      logoBase64 = `data:image/png;base64,${resized.toString('base64')}`
      console.log(`[PDF] logo embedded successfully | base64 length: ${logoBase64.length}`)
    } else {
      console.error('[PDF] mialab-logo-pdf.png not found in any candidate path — using text fallback')
    }
  }

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', ML, y, LOGO_W, LOGO_H)
  } else {
    // Text fallback — only reached if the asset is genuinely missing
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 0, 0)
    doc.text('MIALAB', ML, y + 8)
  }

  // ── DIAGNOSTIC STAMP (remove after confirming correct generator runs) ────────
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(180, 0, 0)
  doc.text('TEST — Mialab_Application/lib/pdf-generator.ts', ML, y - 1)
  // ─────────────────────────────────────────────────────────────────────────────

  // Title to the right of the logo — vertically centred relative to 10mm logo height
  const titleX = ML + LOGO_W + 3
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(25, 25, 25)
  doc.text('Mialab Account Application', titleX, y + 4)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(115, 115, 115)
  doc.text('Wholesale Optical Laboratory', titleX, y + 8.5)

  // Application ID + Submitted date — top right, aligned with header
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(135, 135, 135)
  doc.text(`Application ID: ${applicationId}`, PW - ML, y + 4, { align: 'right' })
  doc.text(`Submitted: ${submittedAt}`, PW - ML, y + 8.5, { align: 'right' })

  y += LOGO_H + 2

  // Full-width divider
  doc.setDrawColor(205, 205, 205)
  doc.setLineWidth(0.4)
  doc.line(ML, y, PW - ML, y)
  y += 4

  // ── PRACTICE / BUSINESS INFORMATION ─────────────────────────────────────────
  sectionHeader('Practice / Business Information')

  fullRow('Practice / Business Name', formData.practiceName)
  if (formData.dbaName) fullRow('DBA / Trade Name', formData.dbaName)
  dualRow('Doctor / Owner', formData.doctorOwnerName, 'Primary Contact', formData.primaryContactName)
  dualRow('Email', formData.email, 'Phone', formData.phone)
  if (formData.website) fullRow('Website', formData.website)
  dualRow('Business Type', formData.businessType, 'Years in Business', formData.yearsInBusiness)
  fullRow('Owner / Principal', formData.isOwnerPrincipal)

  // ── BILLING & A/P INFORMATION ────────────────────────────────────────────────
  sectionHeader('Billing & A/P Information')

  const billingStreet = formData.billingAddress1 +
    (formData.billingAddress2 ? `  ${formData.billingAddress2}` : '')
  fullRow('Billing Address', billingStreet)
  fullRow('City, State, Zip', `${formData.billingCity}, ${formData.billingState}  ${formData.billingZip}`)
  dualRow('A/P Contact', formData.apContactName, 'A/P Email', formData.apEmail)

  // ── SHIPPING INFORMATION ─────────────────────────────────────────────────────
  sectionHeader('Shipping Information')

  if (formData.shippingSameAsBilling) {
    fullRow('Shipping Address', 'Same as billing address')
  } else {
    const shipStreet = (formData.shippingAddress1 || '') +
      (formData.shippingAddress2 ? `  ${formData.shippingAddress2}` : '')
    const shipCSZ = [formData.shippingCity, formData.shippingState, formData.shippingZip]
      .filter(Boolean).join(', ')
    fullRow('Shipping Address', shipStreet || '—')
    if (shipCSZ) fullRow('City, State, Zip', shipCSZ)
  }

  // ── BUSINESS DETAILS ─────────────────────────────────────────────────────────
  sectionHeader('Business Details')

  dualRow('Tax ID / EIN', formData.taxId, 'No. of Locations', formData.numberOfLocations)
  dualRow('Monthly Lab Volume', formData.monthlyLabVolume, 'Weekly Eye Exams', formData.weeklyExams)
  dualRow('In-House Edging', formData.edgeLensesInHouse, 'Lab Orders Managed By', formData.labOrdersManager)
  if (formData.labOrdersContactName) {
    dualRow('Lab Contact Name', formData.labOrdersContactName,
      'Lab Contact Email', formData.labOrdersContactEmail || '')
  }
  dualRow('Plan to Begin Sending', formData.planToBeginSending, 'Reason for Account', formData.mainReason)

  // ── ORDERING, PAYMENT & FINANCIAL ────────────────────────────────────────────
  sectionHeader('Ordering, Payment & Financial')

  const orderDisplay = (formData.orderingMethod === 'other' && formData.otherOrderingMethod)
    ? `Other: ${formData.otherOrderingMethod}`
    : formData.orderingMethod

  const pmLabels: Record<string, string> = {
    check: 'Check',
    ach: 'ACH Bank Transfer',
    debit: 'Debit Card',
    credit: 'Credit Card (+3% fee)',
  }
  dualRow('Ordering Method', orderDisplay,
    'Payment Method', pmLabels[formData.paymentMethod] || formData.paymentMethod)
  dualRow('Resale Certificate', formData.hasResaleCertificate,
    'Apply for Credit', formData.applyForCredit)
  if (formData.applyForCredit === 'yes' && formData.requestedCreditAmount) {
    fullRow('Requested Credit Limit', formData.requestedCreditAmount)
  }

  // ── ACCOUNT AND CREDIT AGREEMENT ─────────────────────────────────────────────
  sectionHeader('Account and Credit Agreement')

  doc.setFontSize(5.9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(58, 58, 58)

  const AGR_LH = 2.75  // tighter line height for agreement text
  const paragraphs = agreementText.split('\n\n').filter(p => p.trim())

  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para.trim(), CW)
    ensureSpace(lines.length * AGR_LH + 1.2)
    for (const line of lines) {
      doc.text(line, ML, y)
      y += AGR_LH
    }
    y += 0.9  // tight paragraph spacing
  }
  y += 2

  // ── ACKNOWLEDGEMENTS ─────────────────────────────────────────────────────────
  sectionHeader('Acknowledgements')

  const ackItems: Array<{ key: keyof typeof acknowledgmentLabels; checked: boolean }> = [
    { key: 'certifyTrueAccurate',      checked: formData.certifyTrueAccurate },
    { key: 'authorizeCreditCheck',     checked: formData.authorizeCreditCheck },
    { key: 'acknowledgeProcessingFee', checked: formData.acknowledgeProcessingFee },
    { key: 'agreeToTerms',             checked: formData.agreeToTerms },
  ]

  for (const ack of ackItems) {
    const label = acknowledgmentLabels[ack.key]
    doc.setFontSize(7.5)
    const labelLines = doc.splitTextToSize(label, CW - 10)
    const h = Math.max(4.3, labelLines.length * 3.8)
    ensureSpace(h)

    // Checkbox
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    if (ack.checked) {
      doc.setTextColor(25, 100, 25)
    } else {
      doc.setTextColor(165, 165, 165)
    }
    doc.text(ack.checked ? '[X]' : '[ ]', ML, y)

    // Label
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 20, 20)
    doc.text(labelLines, ML + 9, y)
    y += h
  }

  y += 2.5

  // ── ELECTRONIC SIGNATURE ─────────────────────────────────────────────────────
  sectionHeader('Electronic Signature')

  dualRow('Printed Name', formData.printedName, 'Title / Position', formData.title)
  dualRow('Method',
    signatureType === 'typed' ? 'Typed signature' : 'Drawn (handwritten)',
    'Date Signed', formData.signatureDate)

  y += 1.5

  const SIG_H = 20
  ensureSpace(SIG_H + 9)

  // Signature box
  doc.setDrawColor(210, 210, 210)
  doc.setFillColor(252, 252, 252)
  doc.roundedRect(ML, y, CW, SIG_H, 1.5, 1.5, 'FD')

  // Watermark label inside box
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(205, 205, 205)
  doc.text('Signature', ML + 3, y + 4.5)

  if (signatureType === 'drawn' && formData.signatureData) {
    try {
      // Compress signature: canvas can be retina (2-3× display size).
      // Resize to 760×150px max before embedding to keep PDF size small.
      let sigData = formData.signatureData
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const sharp = require('sharp')
        const match = sigData.match(/^data:image\/(?:png|jpeg);base64,(.+)$/)
        if (match) {
          const sigBuf = Buffer.from(match[1], 'base64')
          const resized: Buffer = await sharp(sigBuf)
            .resize(760, 150, { fit: 'inside', withoutEnlargement: true })
            .png({ compressionLevel: 9 })
            .toBuffer()
          sigData = `data:image/png;base64,${resized.toString('base64')}`
        }
      } catch {
        // Use original sigData if sharp fails
      }
      doc.addImage(sigData, 'PNG', ML + 3, y + 2, CW - 6, SIG_H - 4)
    } catch {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(170, 170, 170)
      doc.text('[Drawn signature on file]', ML + 10, y + SIG_H / 2 + 1)
    }
  } else {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bolditalic')
    doc.setTextColor(22, 22, 22)
    doc.text(formData.printedName, ML + 5, y + SIG_H / 2 + 3.5)
  }

  y += SIG_H + 3

  // Attestation line
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(135, 135, 135)
  doc.text(
    `Electronically signed by ${formData.printedName}` +
    (formData.title ? `, ${formData.title}` : '') +
    ` on ${formData.signatureDate}. ` +
    `This electronic record constitutes a legally binding signature.`,
    ML, y, { maxWidth: CW }
  )

  // ── FOOTER ON ALL PAGES ──────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(5.8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(175, 175, 175)
    doc.text(
      `Application ID: ${applicationId}  ·  Page ${i} of ${totalPages}`,
      PW / 2, PH - 5, { align: 'center' }
    )
  }

  return doc.output('blob')
}
