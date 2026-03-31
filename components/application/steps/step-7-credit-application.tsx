'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Info } from 'lucide-react'
import type { ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step7Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step7CreditApplication({ formData, updateFormData, errors, lang }: Step7Props) {
  const T = translations[lang].step7
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
          <Label className="text-[#474748]">
            {T.applyLabel} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.applyForCredit}
            onValueChange={(value) => updateFormData({ applyForCredit: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="yes" id="credit-yes" />
              <Label htmlFor="credit-yes" className="cursor-pointer font-normal">
                <span className="font-medium">{T.creditYesLabel}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.creditYesDesc}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="no" id="credit-no" />
              <Label htmlFor="credit-no" className="cursor-pointer font-normal">
                <span className="font-medium">{T.creditNoLabel}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.creditNoDesc}
                </p>
              </Label>
            </div>
          </RadioGroup>
          {errors.applyForCredit && (
            <p className="text-sm text-red-500">{errors.applyForCredit}</p>
          )}
        </div>

        {formData.applyForCredit === 'yes' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="requestedCreditAmount" className="text-[#474748]">
                {T.creditAmountLabel} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="requestedCreditAmount"
                  type="text"
                  value={formData.requestedCreditAmount}
                  onChange={(e) => updateFormData({ requestedCreditAmount: e.target.value })}
                  placeholder="5,000"
                  className={`pl-7 ${errors.requestedCreditAmount ? 'border-red-500' : ''}`}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {T.creditAmountHint}
              </p>
              {errors.requestedCreditAmount && (
                <p className="text-sm text-red-500">{errors.requestedCreditAmount}</p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">{T.creditReviewTitle}</p>
                <p className="mt-1 text-sm text-blue-700">
                  {T.creditReviewDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
