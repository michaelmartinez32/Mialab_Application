'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isSubmitting?: boolean
  canProceed?: boolean
  isLastStep?: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  canProceed = true,
  isLastStep = false,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground"
          disabled={isSubmitting}
        >
          Save and Continue Later
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="gap-2 bg-[#b40000] text-white hover:bg-[#8f0000]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isLastStep ? (
            'Submit Application'
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Mobile sticky navigation
export function MobileStepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  canProceed = true,
  isLastStep = false,
}: StepNavigationProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-lg md:hidden">
      <div className="flex items-center justify-between gap-3">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div className="flex-1" />
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="flex-1 bg-[#b40000] text-white hover:bg-[#8f0000]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isLastStep ? (
            'Submit'
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
