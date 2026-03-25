'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ApplicationFormData } from '@/lib/form-types'

interface Step9Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

const agreementText = `The undersigned applicant ("Applicant") represents and warrants that he or she is duly authorized to submit this application and request credit on behalf of the business identified herein ("Business") and to bind the Business to the terms and conditions of this Agreement. Applicant further represents that all information provided in this application is true, accurate, and complete.

Applicant authorizes Mialab Inc. ("Mialab") to investigate the creditworthiness of the Business and its principals including contacting credit reporting agencies and financial institutions.

Accounts approved for credit are generally extended Net 30 payment terms unless otherwise agreed in writing. Any balance not paid within the stated payment terms may be subject to a finance charge of 1.5% per month (18% per annum) or the maximum permitted by law.

Applicant grants Mialab a purchase money security interest in all goods purchased from Mialab.

Applicant agrees to pay all reasonable collection costs including attorneys' fees and court costs.

Invoices may be paid by check, ACH transfer, debit card, or credit card. Credit card payments are subject to a 3% processing fee. Debit card payments do not include a processing fee.

This Agreement shall be governed by the laws of the State of Florida.

If the individual signing this Agreement is an owner or principal of the business, such individual acknowledges that he or she may be personally responsible for payment of the account if the business fails to satisfy its obligations.

By signing electronically below, Applicant acknowledges that he or she has read and agrees to the terms of this Agreement.`

export function Step9TermsAgreement({ formData, updateFormData, errors }: Step9Props) {
  const checkboxes = [
    {
      id: 'certifyTrueAccurate',
      key: 'certifyTrueAccurate' as const,
      label: 'I certify that the information provided is true and accurate.',
    },
    {
      id: 'authorizeCreditCheck',
      key: 'authorizeCreditCheck' as const,
      label: 'I authorize Mialab to verify credit and business information.',
    },
    {
      id: 'acknowledgeProcessingFee',
      key: 'acknowledgeProcessingFee' as const,
      label: 'I acknowledge that credit card payments are subject to a 3% processing fee.',
    },
    {
      id: 'agreeToTerms',
      key: 'agreeToTerms' as const,
      label: 'I have read and agree to the Mialab Account and Credit Agreement.',
    },
  ]

  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Terms & Credit Agreement
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review and accept the agreement to continue.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[#474748] font-medium">
            Mialab Account and Credit Agreement
          </Label>
          <ScrollArea className="h-64 rounded-lg border bg-gray-50 p-4">
            <div className="space-y-4 pr-4 text-sm text-[#474748] leading-relaxed">
              {agreementText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <Label className="text-[#474748] font-medium">Required Acknowledgments</Label>
          <div className="space-y-3">
            {checkboxes.map((checkbox) => (
              <div
                key={checkbox.id}
                className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                  formData[checkbox.key] ? 'border-[#6fcbdb] bg-[#6fcbdb]/5' : ''
                }`}
              >
                <Checkbox
                  id={checkbox.id}
                  checked={formData[checkbox.key]}
                  onCheckedChange={(checked) =>
                    updateFormData({ [checkbox.key]: checked === true })
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor={checkbox.id}
                  className="cursor-pointer text-sm font-normal leading-relaxed text-[#474748]"
                >
                  {checkbox.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.agreements && (
            <p className="text-sm text-red-500">{errors.agreements}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
