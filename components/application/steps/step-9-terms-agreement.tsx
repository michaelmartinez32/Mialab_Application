'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'
import { agreementText, agreementTextEs } from '@/lib/agreement-text'

interface Step9Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step9TermsAgreement({ formData, updateFormData, errors, lang }: Step9Props) {
  const T = translations[lang].step9
  const activeAgreementText = lang === 'es' ? agreementTextEs : agreementText

  const checkboxKeys = [
    'certifyTrueAccurate',
    'authorizeCreditCheck',
    'acknowledgeProcessingFee',
    'agreeToTerms',
  ] as const

  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          {T.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {T.subtitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[#474748] font-medium">
            {T.agreementTitle}
          </Label>
          <ScrollArea className="h-64 rounded-lg border bg-gray-50 p-4">
            <div className="space-y-4 pr-4 text-sm text-[#474748] leading-relaxed">
              {activeAgreementText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <Label className="text-[#474748] font-medium">{T.acknowledgementsTitle}</Label>
          <div className="space-y-3">
            {checkboxKeys.map((key, idx) => (
              <div
                key={key}
                className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                  formData[key] ? 'border-[#6fcbdb] bg-[#6fcbdb]/5' : ''
                }`}
              >
                <Checkbox
                  id={key}
                  checked={formData[key]}
                  onCheckedChange={(checked) =>
                    updateFormData({ [key]: checked === true })
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor={key}
                  className="cursor-pointer text-sm font-normal leading-relaxed text-[#474748]"
                >
                  {T.checkboxes[idx]}
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
