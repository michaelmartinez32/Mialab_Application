import { NextResponse } from 'next/server'
import { generateApplicationPDF } from '@/lib/pdf-generator'
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

export async function GET() {
  try {
    const pdfBlob = await generateApplicationPDF({
      formData: TEST_FORM_DATA,
      applicationId: `TEST-${Date.now()}`,
      signatureType: 'typed',
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
      }),
    })

    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer())

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="mialab-test-application.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[internal/test-pdf] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF generation failed' },
      { status: 500 }
    )
  }
}
