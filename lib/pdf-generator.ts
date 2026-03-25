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
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 20

  // Two-column layout settings
  const labelColumnWidth = 55 // Fixed width for labels
  const valueColumnX = margin + labelColumnWidth + 5 // X position where values start
  const valueColumnWidth = contentWidth - labelColumnWidth - 5 // Remaining width for values
  const rowSpacing = 7 // Vertical spacing between rows

  // Helper functions
  const addHeader = (text: string) => {
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    y += 4 // Extra spacing before headers
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 0, 0) // #b40000
    doc.text(text, margin, y)
    y += 2
    // Underline for section headers
    doc.setDrawColor(180, 0, 0)
    doc.setLineWidth(0.3)
    doc.line(margin, y, margin + doc.getTextWidth(text), y)
    y += 8
    doc.setTextColor(0, 0, 0)
  }

  const addField = (label: string, value: string) => {
    const displayValue = value || 'N/A'
    
    // Calculate how many lines the value will need
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const valueLines = doc.splitTextToSize(displayValue, valueColumnWidth)
    const lineHeight = 4
    const totalHeight = valueLines.length * lineHeight + rowSpacing
    
    // Check if we need a new page
    if (y + totalHeight > 270) {
      doc.addPage()
      y = 20
    }
    
    // Draw label (left column)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 80)
    doc.text(label, margin, y)
    
    // Draw value (right column)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 30, 30)
    doc.text(valueLines, valueColumnX, y)
    
    // Move to next row
    y += valueLines.length * lineHeight + rowSpacing
  }

  const addSpacer = (height = 8) => {
    y += height
  }

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(153, 0, 0)
  doc.text('MIALAB', pageWidth / 2, y, { align: 'center' })
  y += 8
  doc.setFontSize(14)
  doc.setTextColor(51, 51, 51)
  doc.text('B2B Account Application', pageWidth / 2, y, { align: 'center' })
  y += 10

  // Application metadata
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Application ID: ${applicationId}`, margin, y)
  doc.text(`Submitted: ${submittedAt}`, pageWidth - margin, y, { align: 'right' })
  y += 4
  doc.text(`Agreement Version: ${AGREEMENT_VERSION}`, margin, y)
  y += 10

  // Horizontal line
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // Section 1: Practice Information
  addHeader('1. Practice Information')
  addField('Practice Name', formData.practiceName)
  if (formData.dbaName) addField('DBA Name', formData.dbaName)
  addField('Doctor/Owner Name', formData.doctorOwnerName)
  addField('Primary Contact', formData.primaryContactName)
  addField('Email', formData.email)
  addField('Phone', formData.phone)
  if (formData.website) addField('Website', formData.website)
  addField('Business Type', formData.businessType)
  addField('Years in Business', formData.yearsInBusiness)
  addField('Owner/Principal', formData.isOwnerPrincipal)
  addSpacer()

  // Section 2: Billing Information
  addHeader('2. Billing Information')
  const billingAddress = [
    formData.billingAddress1,
    formData.billingAddress2,
    `${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`
  ].filter(Boolean).join('\n')
  addField('Billing Address', billingAddress.replace(/\n/g, ', '))
  addField('A/P Contact', formData.apContactName)
  addField('A/P Email', formData.apEmail)
  addSpacer()

  // Section 3: Shipping Information
  addHeader('3. Shipping Information')
  if (formData.shippingSameAsBilling) {
    addField('Shipping Address', 'Same as billing address')
  } else {
    const shippingAddress = [
      formData.shippingAddress1,
      formData.shippingAddress2,
      `${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`
    ].filter(Boolean).join(', ')
    addField('Shipping Address', shippingAddress)
  }
  addSpacer()

  // Section 4: Business Details
  addHeader('4. Business Details')
  addField('Tax ID / EIN', formData.taxId)
  addField('Number of Locations', formData.numberOfLocations)
  addField('Monthly Lab Volume', formData.monthlyLabVolume)
  addField('Weekly Exams', formData.weeklyExams)
  addField('Edge Lenses In-House', formData.edgeLensesInHouse)
  addField('Lab Orders Managed By', formData.labOrdersManager)
  if (formData.labOrdersContactName) {
    addField('Lab Orders Contact', `${formData.labOrdersContactName} (${formData.labOrdersContactEmail})`)
  }
  addField('Plan to Begin Sending', formData.planToBeginSending)
  addField('Main Reason for Mialab', formData.mainReason)
  addSpacer()

  // Section 5: Ordering Preferences
  addHeader('5. Ordering Preferences')
  let orderingMethodDisplay = formData.orderingMethod
  if (formData.orderingMethod === 'other' && formData.otherOrderingMethod) {
    orderingMethodDisplay = `Other: ${formData.otherOrderingMethod}`
  }
  addField('Ordering Method', orderingMethodDisplay)
  addSpacer()

  // Section 6: Sales Tax Information
  addHeader('6. Sales Tax Information')
  addField('Has Resale Certificate', formData.hasResaleCertificate)
  if (formData.resaleCertificateFileName) {
    addField('Certificate File', formData.resaleCertificateFileName)
  }
  addSpacer()

  // Section 7: Credit Application
  addHeader('7. Credit Application')
  addField('Apply for Credit', formData.applyForCredit)
  if (formData.applyForCredit === 'yes' && formData.requestedCreditAmount) {
    addField('Requested Credit Amount', formData.requestedCreditAmount)
  }
  addSpacer()

  // Section 8: Payment Preferences
  addHeader('8. Payment Preferences')
  const paymentMethodLabels: Record<string, string> = {
    check: 'Check',
    ach: 'ACH Bank Transfer',
    debit: 'Debit Card',
    credit: 'Credit Card (3% processing fee)',
  }
  addField('Payment Method', paymentMethodLabels[formData.paymentMethod] || formData.paymentMethod)
  addSpacer()

  // New page for Agreement
  doc.addPage()
  y = 20

  // Section 9: Agreement
  addHeader('9. Mialab Account and Credit Agreement')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 51, 51)
  
  const agreementLines = doc.splitTextToSize(agreementText, contentWidth)
  for (const line of agreementLines) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(line, margin, y)
    y += 4
  }
  addSpacer(8)

  // Acknowledgments
  addHeader('Acknowledgments')
  const ackItems = [
    { key: 'certifyTrueAccurate', checked: formData.certifyTrueAccurate },
    { key: 'authorizeCreditCheck', checked: formData.authorizeCreditCheck },
    { key: 'acknowledgeProcessingFee', checked: formData.acknowledgeProcessingFee },
    { key: 'agreeToTerms', checked: formData.agreeToTerms },
  ]
  
  doc.setFontSize(9)
  for (const ack of ackItems) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    const checkmark = ack.checked ? '[X]' : '[ ]'
    const label = acknowledgmentLabels[ack.key as keyof typeof acknowledgmentLabels]
    doc.text(`${checkmark} ${label}`, margin, y)
    y += 6
  }
  addSpacer()

  // Section 10: Signature
  addHeader('10. Electronic Signature')
  addField('Signature Type', signatureType === 'typed' ? 'Typed Signature' : 'Drawn Signature')
  addField('Printed Name', formData.printedName)
  addField('Title', formData.title)
  addField('Date', formData.signatureDate)
  addSpacer(8)

  // Signature box
  if (y > 220) {
    doc.addPage()
    y = 20
  }
  
  doc.setDrawColor(200, 200, 200)
  doc.setFillColor(250, 250, 250)
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'FD')
  
  if (signatureType === 'drawn' && formData.signatureData) {
    // Draw the signature image
    try {
      doc.addImage(formData.signatureData, 'PNG', margin + 5, y + 5, contentWidth - 10, 30)
    } catch {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'italic')
      doc.text('[Signature image]', margin + 10, y + 22)
    }
  } else {
    // Typed signature
    doc.setFontSize(18)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(51, 51, 51)
    doc.text(formData.printedName, margin + 10, y + 25)
  }
  y += 45

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Electronically signed by ${formData.printedName} on ${formData.signatureDate}`, margin, y)
  y += 10

  // Footer
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  const footerText = `This document was electronically generated and signed. Application ID: ${applicationId}`
  doc.text(footerText, pageWidth / 2, 285, { align: 'center' })

  return doc.output('blob')
}
