'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step5Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step5OrderingPreferences({ formData, updateFormData, errors, lang }: Step5Props) {
  const T = translations[lang].step5
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
            {T.orderingMethodLabel} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.orderingMethod}
            onValueChange={(value) => updateFormData({ orderingMethod: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="mialab-portal" id="order-mialab" />
              <Label htmlFor="order-mialab" className="cursor-pointer font-normal">
                <span className="font-medium">{T.options['mialab-portal'].label}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.options['mialab-portal'].description}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="visionweb" id="order-visionweb" />
              <Label htmlFor="order-visionweb" className="cursor-pointer font-normal">
                <span className="font-medium">{T.options['visionweb'].label}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.options['visionweb'].description}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="other-integration" id="order-other" />
              <Label htmlFor="order-other" className="cursor-pointer font-normal">
                <span className="font-medium">{T.options['other-integration'].label}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.options['other-integration'].description}
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="not-sure" id="order-not-sure" />
              <Label htmlFor="order-not-sure" className="cursor-pointer font-normal">
                <span className="font-medium">{T.options['not-sure'].label}</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {T.options['not-sure'].description}
                </p>
              </Label>
            </div>
          </RadioGroup>
          {errors.orderingMethod && (
            <p className="text-sm text-red-500">{errors.orderingMethod}</p>
          )}
        </div>

        {formData.orderingMethod === 'other-integration' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label htmlFor="otherOrderingMethod" className="text-[#474748]">
              {T.otherMethodLabel} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="otherOrderingMethod"
              value={formData.otherOrderingMethod}
              onChange={(e) => updateFormData({ otherOrderingMethod: e.target.value })}
              placeholder={T.otherMethodPlaceholder}
              rows={4}
              className={errors.otherOrderingMethod ? 'border-red-500' : ''}
            />
            {errors.otherOrderingMethod && (
              <p className="text-sm text-red-500">{errors.otherOrderingMethod}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
