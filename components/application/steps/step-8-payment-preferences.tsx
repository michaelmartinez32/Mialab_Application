'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Building2, Wallet, Banknote, Info, Calendar, Receipt } from 'lucide-react'
import type { ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step8Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

const paymentIcons = [Banknote, Building2, Wallet, CreditCard]

export function Step8PaymentPreferences({ formData, updateFormData, errors, lang }: Step8Props) {
  const T = translations[lang].step8
  const selectedOption = T.paymentOptions.find((opt) => opt.value === formData.paymentMethod)

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
            {T.paymentMethodLabel} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => updateFormData({ paymentMethod: value })}
            className="grid gap-3 sm:grid-cols-2"
          >
            {T.paymentOptions.map((option, idx) => {
              const Icon = paymentIcons[idx]
              return (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                    formData.paymentMethod === option.value
                      ? 'border-[#6fcbdb] bg-[#6fcbdb]/5'
                      : ''
                  }`}
                >
                  <RadioGroupItem value={option.value} id={`payment-${option.value}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`payment-${option.value}`} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#474748]" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="mt-1 text-sm font-normal text-muted-foreground">
                        {option.description}
                      </p>
                    </Label>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
          {errors.paymentMethod && (
            <p className="text-sm text-red-500">{errors.paymentMethod}</p>
          )}
        </div>

        {selectedOption?.notice && (
          <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm text-blue-700">{selectedOption.notice}</p>
          </div>
        )}

        {(formData.paymentMethod === 'debit' || formData.paymentMethod === 'credit') && (
          <div className="space-y-4 rounded-lg border bg-gray-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <p className="text-sm font-medium text-[#474748]">{T.cardInfoTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {T.cardInfoDesc}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="cardholderName" className="text-[#474748]">{T.cardholderNameLabel}</Label>
                <Input
                  id="cardholderName"
                  value={formData.cardholderName}
                  onChange={(e) => updateFormData({ cardholderName: e.target.value })}
                  placeholder="John Smith"
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="cardNumber" className="text-[#474748]">{T.cardNumberLabel}</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => updateFormData({ cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cardExpiration" className="text-[#474748]">{T.expirationLabel}</Label>
                <Input
                  id="cardExpiration"
                  value={formData.cardExpiration}
                  onChange={(e) => updateFormData({ cardExpiration: e.target.value })}
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cardCvv" className="text-[#474748]">{T.cvvLabel}</Label>
                <Input
                  id="cardCvv"
                  value={formData.cardCvv}
                  onChange={(e) => updateFormData({ cardCvv: e.target.value })}
                  placeholder="123"
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="cardBillingZip" className="text-[#474748]">{T.billingZipLabel}</Label>
                <Input
                  id="cardBillingZip"
                  value={formData.cardBillingZip}
                  onChange={(e) => updateFormData({ cardBillingZip: e.target.value })}
                  placeholder="12345"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Billing Frequency */}
        <div className="space-y-3">
          <Label className="text-[#474748]">
            {T.billingFrequencyLabel}
          </Label>
          <RadioGroup
            value={formData.billingFrequency}
            onValueChange={(value) => updateFormData({ billingFrequency: value })}
            className="grid gap-3 sm:grid-cols-2"
          >
            <div
              className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                formData.billingFrequency === 'per_shipment'
                  ? 'border-[#6fcbdb] bg-[#6fcbdb]/5'
                  : ''
              }`}
            >
              <RadioGroupItem value="per_shipment" id="billing-per-shipment" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="billing-per-shipment" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-[#474748]" />
                    <span className="font-medium">{T.perShipmentLabel}</span>
                  </div>
                  <p className="mt-1 text-sm font-normal text-muted-foreground">
                    {T.perShipmentDesc}
                  </p>
                </Label>
              </div>
            </div>

            <div
              className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                formData.billingFrequency === 'monthly'
                  ? 'border-[#6fcbdb] bg-[#6fcbdb]/5'
                  : ''
              }`}
            >
              <RadioGroupItem value="monthly" id="billing-monthly" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="billing-monthly" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#474748]" />
                    <span className="font-medium">{T.monthlyLabel}</span>
                    <span className="text-xs text-muted-foreground">{T.monthlyApproval}</span>
                  </div>
                  <p className="mt-1 text-sm font-normal text-muted-foreground">
                    {T.monthlyDesc}
                  </p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
