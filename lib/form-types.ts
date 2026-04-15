export interface AdditionalLocation {
  sameBusinessName: boolean
  locationName: string
  sameEin: boolean
  ein: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  contactPerson: string
  phone: string
  email: string
}

export interface ApplicationFormData {
  // Step 1 - Practice Information
  practiceName: string
  dbaName: string
  doctorOwnerName: string
  primaryContactName: string
  email: string
  phone: string
  website: string
  businessType: string
  yearsInBusiness: string
  isOwnerPrincipal: string

  // Step 2 - Billing Information
  billingAddress1: string
  billingAddress2: string
  billingCity: string
  billingState: string
  billingZip: string
  apContactName: string
  apEmail: string
  monthlyStatementEmailPreference: string

  // Step 3 - Shipping Information
  shippingSameAsBilling: boolean
  shippingAddress1: string
  shippingAddress2: string
  shippingCity: string
  shippingState: string
  shippingZip: string

  // Step 3 - Multiple Locations
  hasMultipleLocations: string
  additionalLocations: AdditionalLocation[]

  // Step 4 - Business Details
  taxId: string
  numberOfLocations: string
  monthlyLabVolume: string
  weeklyExams: string
  edgeLensesInHouse: string
  labOrdersManager: string
  labOrdersContactName: string
  labOrdersContactEmail: string
  planToBeginSending: string
  mainReason: string

  // Step 5 - Ordering Preferences
  orderingMethod: string
  otherOrderingMethod: string

  // Step 6 - Sales Tax Information
  hasResaleCertificate: string
  resaleCertificateFile: File | null
  resaleCertificateFileName: string

  // Step 7 - Credit Application
  applyForCredit: string
  requestedCreditAmount: string

  // Step 8 - Payment Preferences
  paymentMethod: string
  billingFrequency: string
  cardholderName: string
  cardNumber: string
  cardExpiration: string
  cardCvv: string
  cardBillingZip: string

  // Step 9 - Terms Agreement
  certifyTrueAccurate: boolean
  authorizeCreditCheck: boolean
  acknowledgeProcessingFee: boolean
  agreeToTerms: boolean

  // Step 10 - Electronic Signature
  signatureData: string
  printedName: string
  title: string
  signatureDate: string
}

export const initialFormData: ApplicationFormData = {
  // Step 1
  practiceName: '',
  dbaName: '',
  doctorOwnerName: '',
  primaryContactName: '',
  email: '',
  phone: '',
  website: '',
  businessType: '',
  yearsInBusiness: '',
  isOwnerPrincipal: '',

  // Step 2
  billingAddress1: '',
  billingAddress2: '',
  billingCity: '',
  billingState: '',
  billingZip: '',
  apContactName: '',
  apEmail: '',
  monthlyStatementEmailPreference: 'yes',

  // Step 3
  shippingSameAsBilling: true,
  shippingAddress1: '',
  shippingAddress2: '',
  shippingCity: '',
  shippingState: '',
  shippingZip: '',
  hasMultipleLocations: '',
  additionalLocations: [],

  // Step 4
  taxId: '',
  numberOfLocations: '',
  monthlyLabVolume: '',
  weeklyExams: '',
  edgeLensesInHouse: '',
  labOrdersManager: '',
  labOrdersContactName: '',
  labOrdersContactEmail: '',
  planToBeginSending: '',
  mainReason: '',

  // Step 5
  orderingMethod: '',
  otherOrderingMethod: '',

  // Step 6
  hasResaleCertificate: '',
  resaleCertificateFile: null,
  resaleCertificateFileName: '',

  // Step 7
  applyForCredit: '',
  requestedCreditAmount: '',

  // Step 8
  paymentMethod: '',
  billingFrequency: '',
  cardholderName: '',
  cardNumber: '',
  cardExpiration: '',
  cardCvv: '',
  cardBillingZip: '',

  // Step 9
  certifyTrueAccurate: false,
  authorizeCreditCheck: false,
  acknowledgeProcessingFee: false,
  agreeToTerms: false,

  // Step 10
  signatureData: '',
  printedName: '',
  title: '',
  signatureDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
}

export const STEP_TITLES = [
  'Practice Information',
  'Billing Information',
  'Shipping Information',
  'Business Details',
  'Ordering Preferences',
  'Sales Tax Information',
  'Credit Application',
  'Payment Preferences',
  'Terms & Agreement',
  'Electronic Signature',
]

// Consolidated visible steps (3 steps shown to user)
export const VISIBLE_STEP_TITLES = [
  'Practice and Business Details',
  'Billing, Shipping, and Tax Information',
  'Final Review and Submission',
]

// Maps internal step (1-10) to visible step (1-3)
export function getVisibleStep(internalStep: number): number {
  if (internalStep >= 1 && internalStep <= 5) return 1 // Steps 1, 4, 5 (Practice, Business, Ordering)
  if (internalStep >= 2 && internalStep <= 6) return 2 // Steps 2, 3, 6 (Billing, Shipping, Tax)
  return 3 // Steps 7, 8, 9, 10 (Credit, Payment, Terms, Signature)
}

// Correct mapping based on requirements:
// Visible Step 1: Internal steps 1, 4, 5 (Practice Information, Business Details, Ordering Preferences)
// Visible Step 2: Internal steps 2, 3, 6 (Billing Information, Shipping Information, Sales Tax)
// Visible Step 3: Internal steps 7, 8, 9, 10 (Credit, Payment, Terms, Signature)
export function getVisibleStepFromInternal(internalStep: number): number {
  if (internalStep === 1 || internalStep === 4 || internalStep === 5) return 1
  if (internalStep === 2 || internalStep === 3 || internalStep === 6) return 2
  return 3
}

// Internal steps that belong to each visible step
export const VISIBLE_STEP_INTERNAL_STEPS: Record<number, number[]> = {
  1: [1, 4, 5], // Practice Information, Business Details, Ordering Preferences
  2: [2, 3, 6], // Billing Information, Shipping Information, Sales Tax
  3: [7, 8, 9, 10], // Credit, Payment, Terms, Signature
}

// Get the first internal step for a visible step
export function getFirstInternalStep(visibleStep: number): number {
  return VISIBLE_STEP_INTERNAL_STEPS[visibleStep]?.[0] ?? 1
}

// Check if a visible step is complete (all its internal steps are done)
export function isVisibleStepComplete(visibleStep: number, currentInternalStep: number): boolean {
  const internalSteps = VISIBLE_STEP_INTERNAL_STEPS[visibleStep]
  if (!internalSteps) return false
  const maxInternalStep = Math.max(...internalSteps)
  return currentInternalStep > maxInternalStep
}

// Check if we're currently on a visible step
export function isOnVisibleStep(visibleStep: number, currentInternalStep: number): boolean {
  const internalSteps = VISIBLE_STEP_INTERNAL_STEPS[visibleStep]
  if (!internalSteps) return false
  return internalSteps.includes(currentInternalStep)
}

// Estimated completion time for each step (in seconds)
export const STEP_ESTIMATES: { title: string; seconds: number }[] = [
  { title: 'Practice Information', seconds: 60 },
  { title: 'Billing Information', seconds: 60 },
  { title: 'Shipping Information', seconds: 30 },
  { title: 'Business Details', seconds: 60 },
  { title: 'Ordering Preferences', seconds: 30 },
  { title: 'Sales Tax Information', seconds: 30 },
  { title: 'Credit Application', seconds: 30 },
  { title: 'Payment Preferences', seconds: 30 },
  { title: 'Terms & Agreement', seconds: 60 },
  { title: 'Electronic Signature', seconds: 30 },
]

export function formatEstimatedTime(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.round(seconds / 60)
    return `About ${minutes} minute${minutes > 1 ? 's' : ''}`
  }
  return 'About 30 seconds'
}

export function getRemainingTime(currentStep: number): number {
  return STEP_ESTIMATES.slice(currentStep - 1).reduce((acc, step) => acc + step.seconds, 0)
}

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]
