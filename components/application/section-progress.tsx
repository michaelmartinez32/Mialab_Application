'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VISIBLE_STEP_TITLES } from '@/lib/form-types'

interface SectionProgressProps {
  currentStep: number // Internal step (1-10)
  totalSteps: number
}

const VISIBLE_TOTAL_STEPS = 3

// Parent phase groupings based on internal steps
const PHASE_INTERNAL_STEPS: Record<number, number[]> = {
  1: [1, 4, 5],     // Practice Information, Business Details, Ordering Preferences
  2: [2, 3, 6],     // Billing Information, Shipping Information, Sales Tax
  3: [7, 8, 9, 10], // Credit, Payment, Terms, Signature
}

// Maps internal step number → traversal position (1–10 in actual flow order).
// Without this, the progress bar goes backwards when phase 1 (steps 1,4,5) hands
// off to phase 2 (steps 2,3,6) because step 2 < step 5 numerically.
const STEP_TO_ORDERED_POSITION: Record<number, number> = {
  1: 1,
  4: 2,
  5: 3,
  2: 4,
  3: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
}

// Get which parent phase the internal step belongs to
function getParentPhase(internalStep: number): number {
  if (internalStep === 1 || internalStep === 4 || internalStep === 5) return 1
  if (internalStep === 2 || internalStep === 3 || internalStep === 6) return 2
  return 3
}

// Check if a parent phase is complete
function isPhaseComplete(phase: number, currentInternalStep: number): boolean {
  const currentPhase = getParentPhase(currentInternalStep)
  return phase < currentPhase
}

// Check if currently on a phase
function isOnPhase(phase: number, currentInternalStep: number): boolean {
  return getParentPhase(currentInternalStep) === phase
}

// Desktop stepper line: gradual progress within each phase segment.
// Segment 1 spans 0%–50% (between circle 1 and circle 2).
// Segment 2 spans 50%–100% (between circle 2 and circle 3).
// Phase 3 has no next circle so clamps to 100%.
function getStepperLinePercent(currentStep: number, currentPhase: number): number {
  const stepsInPhase = PHASE_INTERNAL_STEPS[currentPhase]
  const indexInPhase = stepsInPhase.indexOf(currentStep) // 0-based
  const stepsCount = stepsInPhase.length

  if (currentPhase === 1) {
    // Segment fills from 0% toward 50% as sub-steps advance
    return (indexInPhase / stepsCount) * 50
  }
  if (currentPhase === 2) {
    // Segment fills from 50% toward 100% as sub-steps advance
    return 50 + (indexInPhase / stepsCount) * 50
  }
  // Phase 3 — all prior segments are complete
  return 100
}

export function SectionProgress({ currentStep, totalSteps }: SectionProgressProps) {
  const currentPhase = getParentPhase(currentStep)

  // Ordered position ensures the bar always moves forward (never backwards)
  const orderedPosition = STEP_TO_ORDERED_POSITION[currentStep] ?? currentStep
  const progressPercent = ((orderedPosition - 1) / (totalSteps - 1)) * 100

  // Desktop stepper line — gradual within phase, never resets
  const stepperLinePercent = getStepperLinePercent(currentStep, currentPhase)

  return (
    <div className="w-full space-y-4">
      {/* Parent Phase Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#b40000]">
          {VISIBLE_STEP_TITLES[currentPhase - 1]}
        </h2>
      </div>

      {/* Overall progress bar — always moves forward */}
      <div className="mx-auto max-w-md">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-[#6fcbdb] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          {Math.round(progressPercent)}% complete
        </p>
      </div>

      {/* Desktop view - 3 parent phase stepper */}
      <div className="hidden lg:block">
        <div className="relative pt-2">
          {/* Progress line background */}
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-200" />

          {/* Progress line filled — gradual, never resets */}
          <div
            className="absolute left-0 top-6 h-0.5 bg-green-500 transition-all duration-500"
            style={{ width: `${stepperLinePercent}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {VISIBLE_STEP_TITLES.map((title, index) => {
              const phaseNumber = index + 1
              const isCompleted = isPhaseComplete(phaseNumber, currentStep)
              const isCurrent = isOnPhase(phaseNumber, currentStep)
              const isFuture = !isCompleted && !isCurrent

              return (
                <div key={phaseNumber} className="flex flex-col items-center" style={{ width: `${100 / VISIBLE_TOTAL_STEPS}%` }}>
                  {/* Phase circle */}
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300',
                      isCompleted && 'border-green-500 bg-green-500 text-white',
                      isCurrent && 'border-[#6fcbdb] bg-white text-[#6fcbdb] ring-4 ring-[#6fcbdb]/20',
                      isFuture && 'border-gray-300 bg-white text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    ) : (
                      phaseNumber
                    )}
                  </div>

                  {/* Phase title */}
                  <span
                    className={cn(
                      'mt-2 text-center text-xs font-medium leading-tight transition-colors',
                      isCompleted && 'text-[#474748]',
                      isCurrent && 'text-[#b40000]',
                      isFuture && 'text-gray-400'
                    )}
                    style={{ maxWidth: '140px' }}
                  >
                    {title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tablet view - compact stepper */}
      <div className="hidden md:block lg:hidden">
        <div className="flex items-center justify-center gap-1">
          {VISIBLE_STEP_TITLES.map((title, index) => {
            const phaseNumber = index + 1
            const isCompleted = isPhaseComplete(phaseNumber, currentStep)
            const isCurrent = isOnPhase(phaseNumber, currentStep)

            return (
              <div key={phaseNumber} className="flex items-center">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-[#6fcbdb]/20 text-[#6fcbdb] ring-2 ring-[#6fcbdb]',
                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  ) : (
                    phaseNumber
                  )}
                </div>
                {index < VISIBLE_TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-8 transition-colors',
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile view - minimal dots */}
      <div className="flex items-center justify-center gap-3 md:hidden">
        {VISIBLE_STEP_TITLES.map((_, index) => {
          const phaseNumber = index + 1
          const isCompleted = isPhaseComplete(phaseNumber, currentStep)
          const isCurrent = isOnPhase(phaseNumber, currentStep)

          return (
            <div
              key={phaseNumber}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isCurrent ? 'w-8 bg-[#6fcbdb]' : 'w-2',
                isCompleted && 'bg-green-500',
                !isCompleted && !isCurrent && 'bg-gray-300'
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
