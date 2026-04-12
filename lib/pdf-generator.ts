import { jsPDF } from 'jspdf'
import type { ApplicationFormData } from './form-types'
import { agreementText, agreementTextEs, acknowledgmentLabels, acknowledgmentLabelsEs, AGREEMENT_VERSION } from './agreement-text'
import { translations, type Lang } from './translations'

interface PDFGeneratorOptions {
  formData: ApplicationFormData
  applicationId: string
  signatureType: 'typed' | 'drawn'
  submittedAt: string
  lang?: Lang
}

export async function generateApplicationPDF(options: PDFGeneratorOptions): Promise<Blob> {
  const { formData, applicationId, signatureType, submittedAt, lang } = options
  const T = translations[lang ?? 'en'].pdf
  const activeAgreementText = (lang === 'es') ? agreementTextEs : agreementText
  const activeAcknowledgmentLabels = (lang === 'es') ? acknowledgmentLabelsEs : acknowledgmentLabels

  // Spanish-specific layout config — tighter spacing to fit one page.
  // English values are unchanged; Spanish values are trimmed just enough to
  // keep the document clean while eliminating the second page overflow.
  const isEs = lang === 'es'
  const CFG = {
    RH:           isEs ? 4.0  : 4.5,   // standard row height (mm)
    SEC_PRE:      isEs ? 1.8  : 2.5,   // vertical gap before section title
    SEC_POST:     isEs ? 3.5  : 4.5,   // vertical gap after section divider line
    AGR_FONT:     isEs ? 6.2  : 5.9,   // agreement paragraph font size
    AGR_LH:       isEs ? 2.72 : 2.75,  // agreement line height (mm)
    AGR_PARA_GAP: isEs ? 0.5  : 0.9,   // gap between agreement paragraphs
    AGR_POST:     isEs ? 1.2  : 2.0,   // space after last agreement paragraph
    ACK_H_MIN:    isEs ? 3.8  : 4.3,   // min height per acknowledgement item
    ACK_LH:       isEs ? 3.5  : 3.8,   // line height inside acknowledgement text
    ACK_POST:     isEs ? 1.5  : 2.5,   // space after acknowledgements block
  }

  const doc = new jsPDF()

  // ── PAGE GEOMETRY ───────────────────────────────────────────────────────────
  const PW = doc.internal.pageSize.getWidth()   // 210mm A4
  const PH = doc.internal.pageSize.getHeight()  // 297mm A4
  const ML = 10                // left/right margin
  const CW = PW - ML * 2       // 190mm usable width
  const GAP = 4                // gap between dual columns
  const HALF = (CW - GAP) / 2  // ~93mm per column
  const RC = ML + HALF + GAP   // right column x

  // Unified label width — applies to both full-width and dual-column rows.
  // All value columns start at ML + LW (left) or RC + LW (right), forming two
  // consistent vertical value rails across the entire document.
  const LW = 36

  // Vertical rhythm
  const RH = CFG.RH       // standard row height (mm) — lang-specific
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
    y += CFG.SEC_PRE
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 0, 0)
    doc.text(title, ML, y)
    y += 1.8
    doc.setDrawColor(180, 0, 0)
    doc.setLineWidth(0.2)
    doc.line(ML, y, ML + CW, y)
    y += CFG.SEC_POST
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
    const vW = HALF - LW - 1
    const lWrap = doc.splitTextToSize(lValue || '—', vW).length > 1
    const rWrap = doc.splitTextToSize(rValue || '—', vW).length > 1
    const extra = (lWrap || rWrap) ? 1 : 0
    const h = RH + extra * 3.2
    ensureSpace(h)
    renderPair(lLabel, lValue, ML, LW, vW, y)
    renderPair(rLabel, rValue, RC, LW, vW, y)
    y += h
  }

  // Single full-width field
  const fullRow = (label: string, value: string) => {
    const v = value || '—'
    doc.setFontSize(7.5)
    const vW = CW - LW - 1
    const lines = doc.splitTextToSize(v, vW)
    const h = Math.max(RH, lines.length * 3.5)
    ensureSpace(h)
    renderPair(label, v, ML, LW, vW, y)
    y += h
  }

  // ── HEADER: LOGO + TITLE + META ─────────────────────────────────────────────
  // Asset: public/mialab-logo.png — 480×258px, 49KB (same file as Quick Send).
  // Loaded via fs + sharp, embedded as base64 PNG — same approach as Quick Send.
  const LOGO_H = 12   // mm — small, balanced
  const LOGO_W_MAX = 45
  let LOGO_W = 22     // default at 480:258 aspect; overwritten from actual metadata

  let logoBase64: string | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp')

    const candidates = [
      path.join(process.cwd(), 'public', 'mialab-logo.png'),
      path.join(__dirname, '..', '..', 'public', 'mialab-logo.png'),
      path.join(__dirname, '..', 'public', 'mialab-logo.png'),
    ]
    let buf: Buffer | null = null
    for (const p of candidates) {
      if (fs.existsSync(p)) { buf = fs.readFileSync(p); break }
    }
    if (buf) {
      const meta = await sharp(buf).metadata()
      if (meta.width && meta.height) {
        LOGO_W = Math.min(+(( meta.width / meta.height) * LOGO_H).toFixed(1), LOGO_W_MAX)
      }
      const resized: Buffer = await sharp(buf)
        .resize(Math.round(LOGO_W * (96 / 25.4)), Math.round(LOGO_H * (96 / 25.4)), { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()
      logoBase64 = `data:image/png;base64,${resized.toString('base64')}`
    }
  } catch { /* silent — fall through to text-only header */ }

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', ML, y, LOGO_W, LOGO_H)
  }

  const titleX = logoBase64 ? ML + LOGO_W + 3 : ML
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(25, 25, 25)
  doc.text(T.title, titleX, y + 4)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(115, 115, 115)
  doc.text(T.subtitle, titleX, y + 9.5)

  // Application ID + Submitted date — right-aligned
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(135, 135, 135)
  doc.text(`${T.applicationIdLabel}: ${applicationId}`, PW - ML, y + 4, { align: 'right' })
  doc.text(`${T.submittedLabel}: ${submittedAt}`, PW - ML, y + 9.5, { align: 'right' })

  y += 16

  // Full-width divider
  doc.setDrawColor(205, 205, 205)
  doc.setLineWidth(0.4)
  doc.line(ML, y, PW - ML, y)
  y += 4

  // ── PRACTICE / BUSINESS INFORMATION ─────────────────────────────────────────
  sectionHeader(T.sections.practiceInfo)

  fullRow(T.fields.practiceName, formData.practiceName)
  if (formData.dbaName) fullRow(T.fields.dbaName, formData.dbaName)
  dualRow(T.fields.doctorOwner, formData.doctorOwnerName, T.fields.primaryContact, formData.primaryContactName)
  dualRow(T.fields.email, formData.email, T.fields.phone, formData.phone)
  if (formData.website) fullRow(T.fields.website, formData.website)
  dualRow(T.fields.businessType, formData.businessType, T.fields.yearsInBusiness, formData.yearsInBusiness)
  fullRow(T.fields.ownerPrincipal, formData.isOwnerPrincipal)

  // ── BILLING & A/P INFORMATION ────────────────────────────────────────────────
  sectionHeader(T.sections.billing)

  const billingStreet = formData.billingAddress1 +
    (formData.billingAddress2 ? `  ${formData.billingAddress2}` : '')
  fullRow(T.fields.billingAddress, billingStreet)
  dualRow(T.fields.cityStateZip, `${formData.billingCity}, ${formData.billingState}  ${formData.billingZip}`, T.fields.apContact, formData.apContactName)
  const monthlyStmtDisplay = formData.monthlyStatementEmailPreference === 'yes'
    ? (isEs ? 'Sí' : 'Yes')
    : formData.monthlyStatementEmailPreference === 'no' ? 'No' : formData.monthlyStatementEmailPreference
  dualRow(T.fields.monthlyStatementEmail, monthlyStmtDisplay, T.fields.apEmail, formData.apEmail)

  // ── SHIPPING INFORMATION ─────────────────────────────────────────────────────
  sectionHeader(T.sections.shipping)

  if (formData.shippingSameAsBilling) {
    fullRow(T.fields.shippingAddress, T.fields.sameAsBilling)
  } else {
    const shipStreet = (formData.shippingAddress1 || '') +
      (formData.shippingAddress2 ? `  ${formData.shippingAddress2}` : '')
    const shipCSZ = [formData.shippingCity, formData.shippingState, formData.shippingZip]
      .filter(Boolean).join(', ')
    fullRow(T.fields.shippingAddress, shipStreet || '—')
    if (shipCSZ) fullRow(T.fields.cityStateZip, shipCSZ)
  }

  // ── ADDITIONAL LOCATIONS ─────────────────────────────────────────────────────
  if (formData.hasMultipleLocations === 'yes' && formData.additionalLocations?.length) {
    sectionHeader(isEs ? 'Sucursales Adicionales' : 'Additional Locations')
    for (let i = 0; i < formData.additionalLocations.length; i++) {
      const loc = formData.additionalLocations[i]
      const locLabel = isEs ? `Sucursal ${i + 1}` : `Location ${i + 1}`
      const locName = loc.sameBusinessName
        ? formData.practiceName
        : loc.locationName || '—'
      fullRow(locLabel, locName)
      const locStreet = loc.address1 + (loc.address2 ? `  ${loc.address2}` : '')
      fullRow(isEs ? 'Dirección' : 'Address', locStreet || '—')
      const locCSZ = [loc.city, loc.state, loc.zip].filter(Boolean).join(', ')
      if (locCSZ) fullRow(isEs ? 'Ciudad, Estado, C.P.' : 'City, State, ZIP', locCSZ)
      if (loc.contactPerson) {
        dualRow(
          isEs ? 'Persona de Contacto' : 'Contact Person', loc.contactPerson,
          isEs ? 'Teléfono' : 'Phone', loc.phone || '—'
        )
      }
      if (loc.email) fullRow(isEs ? 'Correo' : 'Email', loc.email)
      if (i < formData.additionalLocations.length - 1) y += 2
    }
  }

  // ── BUSINESS DETAILS ─────────────────────────────────────────────────────────
  sectionHeader(T.sections.businessDetails)

  dualRow(T.fields.taxId, formData.taxId, T.fields.numLocations, formData.numberOfLocations)
  dualRow(T.fields.monthlyLabVolume, formData.monthlyLabVolume, T.fields.weeklyExams, formData.weeklyExams)
  dualRow(T.fields.inHouseEdging, formData.edgeLensesInHouse, T.fields.labOrdersManagedBy, formData.labOrdersManager)
  if (formData.labOrdersContactName) {
    dualRow(T.fields.labContactName, formData.labOrdersContactName,
      T.fields.labContactEmail, formData.labOrdersContactEmail || '')
  }
  dualRow(T.fields.planToBegin, formData.planToBeginSending, T.fields.mainReason, formData.mainReason)

  // ── ORDERING, PAYMENT & FINANCIAL ────────────────────────────────────────────
  sectionHeader(T.sections.orderingPayment)

  const orderDisplay = (formData.orderingMethod === 'other' && formData.otherOrderingMethod)
    ? `Other: ${formData.otherOrderingMethod}`
    : formData.orderingMethod

  const pmLabels: Record<string, string> = {
    check: 'Check',
    ach: 'ACH Bank Transfer',
    debit: 'Debit Card',
    credit: 'Credit Card (+3% fee)',
  }
  dualRow(T.fields.orderingMethod, orderDisplay,
    T.fields.paymentMethod, pmLabels[formData.paymentMethod] || formData.paymentMethod)
  dualRow(T.fields.resaleCertificate, formData.hasResaleCertificate,
    T.fields.applyForCredit, formData.applyForCredit)
  if (formData.applyForCredit === 'yes' && formData.requestedCreditAmount) {
    fullRow(T.fields.requestedCreditLimit, formData.requestedCreditAmount)
  }

  // ── ACCOUNT AND CREDIT AGREEMENT ─────────────────────────────────────────────
  sectionHeader(T.sections.agreement)

  doc.setFontSize(CFG.AGR_FONT)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(58, 58, 58)

  const paragraphs = activeAgreementText.split('\n\n').filter(p => p.trim())

  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para.trim(), CW)
    ensureSpace(lines.length * CFG.AGR_LH + 1.2)
    for (const line of lines) {
      doc.text(line, ML, y)
      y += CFG.AGR_LH
    }
    y += CFG.AGR_PARA_GAP
  }
  y += CFG.AGR_POST

  // ── ACKNOWLEDGEMENTS ─────────────────────────────────────────────────────────
  sectionHeader(T.sections.acknowledgements)

  const ackItems: Array<{ key: keyof typeof acknowledgmentLabels; checked: boolean }> = [
    { key: 'certifyTrueAccurate',      checked: formData.certifyTrueAccurate },
    { key: 'authorizeCreditCheck',     checked: formData.authorizeCreditCheck },
    { key: 'acknowledgeProcessingFee', checked: formData.acknowledgeProcessingFee },
    { key: 'agreeToTerms',             checked: formData.agreeToTerms },
  ]

  for (const ack of ackItems) {
    const label = activeAcknowledgmentLabels[ack.key]
    doc.setFontSize(7.5)
    const labelLines = doc.splitTextToSize(label, CW - 10)
    const h = Math.max(CFG.ACK_H_MIN, labelLines.length * CFG.ACK_LH)
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

  y += CFG.ACK_POST

  // ── ELECTRONIC SIGNATURE ─────────────────────────────────────────────────────
  sectionHeader(T.sections.signature)

  dualRow(T.fields.printedName, formData.printedName, T.fields.titlePosition, formData.title)
  dualRow(T.fields.method,
    signatureType === 'typed' ? T.fields.typedSignature : T.fields.drawnSignature,
    T.fields.dateSigned, formData.signatureDate)

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
  doc.text(T.fields.signatureLabel, ML + 3, y + 4.5)

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
    `${T.electronicallySigned} ${formData.printedName}` +
    (formData.title ? `, ${formData.title}` : '') +
    ` on ${formData.signatureDate}. ` +
    T.legalNote,
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
      T.footer(applicationId, i, totalPages),
      PW / 2, PH - 5, { align: 'center' }
    )
  }

  return doc.output('blob')
}
