'use client'

import { useState, useCallback } from 'react'
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

    switch (step) {
      case 1:
        if (!formData.practiceName.trim()) newErrors.practiceName = 'Practice name is required'
        if (!formData.doctorOwnerName.trim()) newErrors.doctorOwnerName = 'Doctor/Owner name is required'
        if (!formData.primaryContactName.trim()) newErrors.primaryContactName = 'Primary contact name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.businessType) newErrors.businessType = 'Business type is required'
        if (!formData.yearsInBusiness) newErrors.yearsInBusiness = 'Years in business is required'
        if (!formData.isOwnerPrincipal) newErrors.isOwnerPrincipal = 'Please select an option'
        break
      case 2:
        if (!formData.billingAddress1.trim()) newErrors.billingAddress1 = 'Billing address is required'
        if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required'
        if (!formData.billingState) newErrors.billingState = 'State is required'
        if (!formData.billingZip.trim()) newErrors.billingZip = 'ZIP code is required'
        if (!formData.apContactName.trim()) newErrors.apContactName = 'AP contact name is required'
        if (!formData.apEmail.trim()) newErrors.apEmail = 'AP email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.apEmail)) newErrors.apEmail = 'Invalid email format'
        break
      case 3:
        if (!formData.shippingSameAsBilling) {
          if (!formData.shippingAddress1.trim()) newErrors.shippingAddress1 = 'Shipping address is required'
          if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required'
          if (!formData.shippingState) newErrors.shippingState = 'State is required'
          if (!formData.shippingZip.trim()) newErrors.shippingZip = 'ZIP code is required'
        }
        break
      case 4:
        if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required'
        if (!formData.numberOfLocations) newErrors.numberOfLocations = 'Number of locations is required'
        if (!formData.monthlyLabVolume) newErrors.monthlyLabVolume = 'Monthly lab volume is required'
        if (!formData.weeklyExams) newErrors.weeklyExams = 'Weekly exams is required'
        if (!formData.edgeLensesInHouse) newErrors.edgeLensesInHouse = 'Please select an option'
        if (!formData.labOrdersManager) newErrors.labOrdersManager = 'Please select who manages lab orders'
        if (!formData.planToBeginSending) newErrors.planToBeginSending = 'Please select a timeline'
        if (!formData.mainReason) newErrors.mainReason = 'Please select a reason'
        break
      case 5:
        if (!formData.orderingMethod) newErrors.orderingMethod = 'Please select an ordering method'
        if (formData.orderingMethod === 'other-integration' && !formData.otherOrderingMethod.trim()) {
          newErrors.otherOrderingMethod = 'Please describe your ordering method'
        }
        break
      case 6:
        if (!formData.hasResaleCertificate) newErrors.hasResaleCertificate = 'Please select an option'
        if (formData.hasResaleCertificate === 'yes' && !formData.resaleCertificateFile) {
          newErrors.resaleCertificateFile = 'Please upload your resale certificate'
        }
        break
      case 7:
        if (!formData.applyForCredit) newErrors.applyForCredit = 'Please select an option'
        if (formData.applyForCredit === 'yes' && !formData.requestedCreditAmount.trim()) {
          newErrors.requestedCreditAmount = 'Please enter a credit amount'
        }
        break
      case 8:
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method'
        break
      case 9:
        if (!formData.certifyTrueAccurate || !formData.authorizeCreditCheck || 
            !formData.acknowledgeProcessingFee || !formData.agreeToTerms) {
          newErrors.agreements = 'Please accept all agreements to continue'
        }
        break
      case 10:
        if (!formData.signatureData) newErrors.signatureData = 'Signature is required'
        if (!formData.printedName.trim()) newErrors.printedName = 'Printed name is required'
        if (!formData.title.trim()) newErrors.title = 'Title/Position is required'
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
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isSubmitted && submissionResult) {
    return (
      <div className="min-h-screen bg-white">
        <ApplicationHeader />
        <ConfirmationPage 
          applicationId={submissionResult.applicationId}
          submittedAt={submissionResult.submittedAt}
          email={formData.email}
        />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PracticeInfo formData={formData} updateFormData={updateFormData} errors={errors} />
      case 2:
        return <Step2BillingInfo formData={formData} updateFormData={updateFormData} errors={errors} />
      case 3:
        return <Step3ShippingInfo formData={formData} updateFormData={updateFormData} errors={errors} />
      case 4:
        return <Step4BusinessDetails formData={formData} updateFormData={updateFormData} errors={errors} />
      case 5:
        return <Step5OrderingPreferences formData={formData} updateFormData={updateFormData} errors={errors} />
      case 6:
        return <Step6SalesTax formData={formData} updateFormData={updateFormData} errors={errors} />
      case 7:
        return <Step7CreditApplication formData={formData} updateFormData={updateFormData} errors={errors} />
      case 8:
        return <Step8PaymentPreferences formData={formData} updateFormData={updateFormData} errors={errors} />
      case 9:
        return <Step9TermsAgreement formData={formData} updateFormData={updateFormData} errors={errors} />
      case 10:
        return (
          <Step10ElectronicSignature 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors}
            signatureType={signatureType}
            onSignatureTypeChange={setSignatureType}
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
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#474748]">
            Open a Mialab Account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete the application below to open your account with Mialab.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mb-6">
          <TrustIndicators />
        </div>

        {/* Section progress indicator */}
        <div className="mb-8">
          <SectionProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Submission Error</p>
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
      />
    </div>
  )
}
