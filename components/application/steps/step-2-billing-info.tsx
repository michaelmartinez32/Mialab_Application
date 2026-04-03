'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationFormData } from '@/lib/form-types'
import { US_STATES } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step2Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step2BillingInfo({ formData, updateFormData, errors, lang }: Step2Props) {
  const T = translations[lang].step2
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
        <div className="space-y-2">
          <Label htmlFor="billingAddress1" className="text-[#474748]">
            {T.address1Label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="billingAddress1"
            value={formData.billingAddress1}
            onChange={(e) => updateFormData({ billingAddress1: e.target.value })}
            placeholder={T.address1Placeholder}
            className={errors.billingAddress1 ? 'border-red-500' : ''}
          />
          {errors.billingAddress1 && (
            <p className="text-sm text-red-500">{errors.billingAddress1}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingAddress2" className="text-[#474748]">
            {T.address2Label} <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="billingAddress2"
            value={formData.billingAddress2}
            onChange={(e) => updateFormData({ billingAddress2: e.target.value })}
            placeholder={T.address2Placeholder}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="billingCity" className="text-[#474748]">
              {T.cityLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billingCity"
              value={formData.billingCity}
              onChange={(e) => updateFormData({ billingCity: e.target.value })}
              placeholder={T.cityPlaceholder}
              className={errors.billingCity ? 'border-red-500' : ''}
            />
            {errors.billingCity && (
              <p className="text-sm text-red-500">{errors.billingCity}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingState" className="text-[#474748]">
              {T.stateLabel} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.billingState}
              onValueChange={(value) => updateFormData({ billingState: value })}
            >
              <SelectTrigger className={errors.billingState ? 'border-red-500' : ''}>
                <SelectValue placeholder={T.statePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.billingState && (
              <p className="text-sm text-red-500">{errors.billingState}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingZip" className="text-[#474748]">
              {T.zipLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billingZip"
              value={formData.billingZip}
              onChange={(e) => updateFormData({ billingZip: e.target.value })}
              placeholder={T.zipPlaceholder}
              className={errors.billingZip ? 'border-red-500' : ''}
            />
            {errors.billingZip && (
              <p className="text-sm text-red-500">{errors.billingZip}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium text-[#474748]">{T.apSectionTitle}</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apContactName" className="text-[#474748]">
                {T.apContactNameLabel} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apContactName"
                value={formData.apContactName}
                onChange={(e) => updateFormData({ apContactName: e.target.value })}
                placeholder={T.apContactNamePlaceholder}
                className={errors.apContactName ? 'border-red-500' : ''}
              />
              {errors.apContactName && (
                <p className="text-sm text-red-500">{errors.apContactName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apEmail" className="text-[#474748]">
                {T.apEmailLabel} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apEmail"
                type="email"
                value={formData.apEmail}
                onChange={(e) => updateFormData({ apEmail: e.target.value })}
                placeholder={T.apEmailPlaceholder}
                className={errors.apEmail ? 'border-red-500' : ''}
              />
              {errors.apEmail && (
                <p className="text-sm text-red-500">{errors.apEmail}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Label className="text-[#474748]">
              {T.monthlyStatementEmailLabel} <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.monthlyStatementEmailPreference}
              onValueChange={(value) => updateFormData({ monthlyStatementEmailPreference: value })}
              className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                <RadioGroupItem value="yes" id="monthly-statement-yes" />
                <Label htmlFor="monthly-statement-yes" className="cursor-pointer font-normal">
                  {T.monthlyStatementYes}
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                <RadioGroupItem value="no" id="monthly-statement-no" />
                <Label htmlFor="monthly-statement-no" className="cursor-pointer font-normal">
                  {T.monthlyStatementNo}
                </Label>
              </div>
            </RadioGroup>
            {errors.monthlyStatementEmailPreference && (
              <p className="text-sm text-red-500">{errors.monthlyStatementEmailPreference}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
