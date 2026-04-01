'use client'

import { useState, useCallback, useEffect } from 'react'
import { ApplicationHeader } from './application-header'
import { SectionProgress } from './section-progress'
import { TrustIndicators } from './trust-indicators'
import { StepNavigation, MobileStepNavigation } from './step-navigation'
import { ConfirmationPage } from './confirmation-page'
import { Step1PracticeInfo } from './steps/step-1-practice-info'
import { Step2BillingInfo } from './steps/step-2-billing-info'
import { Step3ShippingInfo } from './steps/step-3-shipping-info'
import { Step4BusinessDetails } from './steps/step-4-business-details'
import { Step5OrderingPreferences } from './steps/step-5-ordering-preferences'
import { Step6SalesTax } from './steps/step-6-sales-tax'
import { Step7CreditApplication } from './steps/step-7-credit-application'
import { Step8PaymentPreferences } from './steps/step-8-payment-preferences'
import { Step9TermsAgreement } from './steps/step-9-terms-agreement'
import { Step10ElectronicSignature } from './steps/step-10-electronic-signature'
import { initialFormData, type ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

const TOTAL_STEPS = 10

interface SubmissionResult {
  applicationId: string
  submittedAt: string
}

export function ApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [signatureType, setSignatureType] = useState<'typed' | 'drawn'>('drawn')
  const [resaleCertificatePath, setResaleCertificatePath] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>('en')

  // Persist lang to sessionStorage so the internal test panel can read it
  useEffect(() => {
    sessionStorage.setItem('mialab-lang', lang)
  }, [lang])

  // Scroll to top after every step transition and after submission.
  // Runs after React commits the new content to the DOM, so the scroll
  // always lands on the freshly-rendered step — not the previous one.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep, isSubmitted])

  const T = translations[lang]

  const updateFormData = useCallback((data: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    // Clear errors for updated fields
    const updatedKeys = Object.keys(data)
    setErrors((prev) => {
      const newErrors = { ...prev }
      updatedKeys.forEach((key) => {
        delete newErrors[key]
      })
      return newErrors
    })
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    const V = T.validation

    switch (step) {
      case 1:
        if (!formData.practiceName.trim()) newErrors.practiceName = V.practiceNameRequired
        if (!formData.doctorOwnerName.trim()) newErrors.doctorOwnerName = V.doctorOwnerRequired
        if (!formData.primaryContactName.trim()) newErrors.primaryContactName = V.primaryContactRequired
        if (!formData.email.trim()) newErrors.email = V.emailRequired
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = V.emailInvalid
        if (!formData.phone.trim()) newErrors.phone = V.phoneRequired
        if (!formData.businessType) newErrors.businessType = V.businessTypeRequired
        if (!formData.yearsInBusiness) newErrors.yearsInBusiness = V.yearsInBusinessRequired
        if (!formData.isOwnerPrincipal) newErrors.isOwnerPrincipal = V.pleaseSelectOption
        break
      case 2:
        if (!formData.billingAddress1.trim()) newErrors.billingAddress1 = V.billingAddress1Required
        if (!formData.billingCity.trim()) newErrors.billingCity = V.cityRequired
        if (!formData.billingState) newErrors.billingState = V.stateRequired
        if (!formData.billingZip.trim()) newErrors.billingZip = V.zipRequired
        if (!formData.apContactName.trim()) newErrors.apContactName = V.apContactRequired
        if (!formData.apEmail.trim()) newErrors.apEmail = V.apEmailRequired
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.apEmail)) newErrors.apEmail = V.emailInvalid
        break
      case 3:
        if (!formData.shippingSameAsBilling) {
          if (!formData.shippingAddress1.trim()) newErrors.shippingAddress1 = V.shippingAddress1Required
          if (!formData.shippingCity.trim()) newErrors.shippingCity = V.cityRequired
          if (!formData.shippingState) newErrors.shippingState = V.stateRequired
          if (!formData.shippingZip.trim()) newErrors.shippingZip = V.zipRequired
        }
        break
      case 4:
        if (!formData.taxId.trim()) newErrors.taxId = V.taxIdRequired
        if (!formData.numberOfLocations) newErrors.numberOfLocations = V.numLocationsRequired
        if (!formData.monthlyLabVolume) newErrors.monthlyLabVolume = V.monthlyVolumeRequired
        if (!formData.weeklyExams) newErrors.weeklyExams = V.weeklyExamsRequired
        if (!formData.edgeLensesInHouse) newErrors.edgeLensesInHouse = V.pleaseSelectOption
        if (!formData.labOrdersManager) newErrors.labOrdersManager = V.labManagerRequired
        if (!formData.planToBeginSending) newErrors.planToBeginSending = V.planToBeginRequired
        if (!formData.mainReason) newErrors.mainReason = V.mainReasonRequired
        break
      case 5:
        if (!formData.orderingMethod) newErrors.orderingMethod = V.orderingMethodRequired
        if (formData.orderingMethod === 'other-integration' && !formData.otherOrderingMethod.trim()) {
          newErrors.otherOrderingMethod = V.describeMethodRequired
        }
        break
      case 6:
        if (!formData.hasResaleCertificate) newErrors.hasResaleCertificate = V.resaleCertRequired
        if (formData.hasResaleCertificate === 'yes' && !formData.resaleCertificateFile) {
          newErrors.resaleCertificateFile = V.uploadCertRequired
        }
        break
      case 7:
        if (!formData.applyForCredit) newErrors.applyForCredit = V.creditDecisionRequired
        if (formData.applyForCredit === 'yes' && !formData.requestedCreditAmount.trim()) {
          newErrors.requestedCreditAmount = V.creditAmountRequired
        }
        break
      case 8:
        if (!formData.paymentMethod) newErrors.paymentMethod = V.paymentMethodRequired
        break
      case 9:
        if (!formData.certifyTrueAccurate || !formData.authorizeCreditCheck ||
            !formData.acknowledgeProcessingFee || !formData.agreeToTerms) {
          newErrors.agreements = V.allAgreementsRequired
        }
        break
      case 10:
        if (!formData.signatureData) newErrors.signatureData = V.signatureRequired
        if (!formData.printedName.trim()) newErrors.printedName = V.printedNameRequired
        if (!formData.title.trim()) newErrors.title = V.titleRequired
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Upload resale certificate if provided
  const uploadResaleCertificate = async (tempApplicationId: string): Promise<string | null> => {
    if (!formData.resaleCertificateFile) return null

    const uploadFormData = new FormData()
    uploadFormData.append('file', formData.resaleCertificateFile)
    uploadFormData.append('applicationId', tempApplicationId)
    uploadFormData.append('documentType', 'resale_certificate')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload resale certificate')
    }

    const result = await response.json()
    return result.pathname
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Generate a temporary ID for file uploads before submission
      const tempId = crypto.randomUUID()

      // Upload resale certificate if provided
      let certificatePath = resaleCertificatePath
      if (formData.resaleCertificateFile && !certificatePath) {
        certificatePath = await uploadResaleCertificate(tempId)
        setResaleCertificatePath(certificatePath)
      }

      // Submit the application
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          signatureType,
          resaleCertificatePath: certificatePath,
          lang,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setSubmissionResult({
        applicationId: result.applicationId,
        submittedAt: result.submittedAt,
      })
      setIsSubmitted(true)

    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error instanceof Error ? error.message : T.validation.submitFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep === TOTAL_STEPS) {
      await handleSubmit()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  if (isSubmitted && submissionResult) {
    return (
      <div className="min-h-screen bg-white">
        <ApplicationHeader />
        <ConfirmationPage
          applicationId={submissionResult.applicationId}
          submittedAt={submissionResult.submittedAt}
          email={formData.email}
          lang={lang}
        />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PracticeInfo formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 2:
        return <Step2BillingInfo formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 3:
        return <Step3ShippingInfo formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 4:
        return <Step4BusinessDetails formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 5:
        return <Step5OrderingPreferences formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 6:
        return <Step6SalesTax formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 7:
        return <Step7CreditApplication formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 8:
        return <Step8PaymentPreferences formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 9:
        return <Step9TermsAgreement formData={formData} updateFormData={updateFormData} errors={errors} lang={lang} />
      case 10:
        return (
          <Step10ElectronicSignature
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            signatureType={signatureType}
            onSignatureTypeChange={setSignatureType}
            lang={lang}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-24 md:pb-8">
      <ApplicationHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Language toggle */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center rounded-full border border-gray-200 bg-white p-0.5 text-sm shadow-sm">
            <button
              onClick={() => setLang('en')}
              className={`rounded-full px-3 py-1 transition-colors ${
                lang === 'en'
                  ? 'bg-[#b40000] text-white font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`rounded-full px-3 py-1 transition-colors ${
                lang === 'es'
                  ? 'bg-[#b40000] text-white font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#474748]">
            {T.wizard.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {T.wizard.subtitle}
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mb-6">
          <TrustIndicators lang={lang} />
        </div>

        {/* Section progress indicator */}
        <div className="mb-8">
          <SectionProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} lang={lang} />
        </div>

        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">{T.wizard.submissionError}</p>
            <p>{submitError}</p>
          </div>
        )}

        {/* Step content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            isLastStep={currentStep === TOTAL_STEPS}
            lang={lang}
          />
        </div>
      </main>

      <MobileStepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isSubmitting={isSubmitting}
        isLastStep={currentStep === TOTAL_STEPS}
        lang={lang}
      />
    </div>
  )
}
