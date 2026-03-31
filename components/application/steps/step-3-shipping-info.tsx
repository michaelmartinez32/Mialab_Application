'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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

interface Step3Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step3ShippingInfo({ formData, updateFormData, errors, lang }: Step3Props) {
  const T = translations[lang].step3
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
        <div className="flex items-center space-x-3 rounded-lg border bg-gray-50 p-4">
          <Checkbox
            id="shippingSameAsBilling"
            checked={formData.shippingSameAsBilling}
            onCheckedChange={(checked) =>
              updateFormData({ shippingSameAsBilling: checked === true })
            }
          />
          <Label
            htmlFor="shippingSameAsBilling"
            className="cursor-pointer font-normal text-[#474748]"
          >
            {T.sameAsBilling}
          </Label>
        </div>

        {!formData.shippingSameAsBilling && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="shippingAddress1" className="text-[#474748]">
                {T.shippingAddressLabel} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingAddress1"
                value={formData.shippingAddress1}
                onChange={(e) => updateFormData({ shippingAddress1: e.target.value })}
                placeholder={T.streetPlaceholder}
                className={errors.shippingAddress1 ? 'border-red-500' : ''}
              />
              {errors.shippingAddress1 && (
                <p className="text-sm text-red-500">{errors.shippingAddress1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress2" className="text-[#474748]">
                {T.address2Label} <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="shippingAddress2"
                value={formData.shippingAddress2}
                onChange={(e) => updateFormData({ shippingAddress2: e.target.value })}
                placeholder={T.address2Placeholder}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="shippingCity" className="text-[#474748]">
                  {T.cityLabel} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingCity"
                  value={formData.shippingCity}
                  onChange={(e) => updateFormData({ shippingCity: e.target.value })}
                  placeholder={T.cityPlaceholder}
                  className={errors.shippingCity ? 'border-red-500' : ''}
                />
                {errors.shippingCity && (
                  <p className="text-sm text-red-500">{errors.shippingCity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingState" className="text-[#474748]">
                  {T.stateLabel} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.shippingState}
                  onValueChange={(value) => updateFormData({ shippingState: value })}
                >
                  <SelectTrigger className={errors.shippingState ? 'border-red-500' : ''}>
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
                {errors.shippingState && (
                  <p className="text-sm text-red-500">{errors.shippingState}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingZip" className="text-[#474748]">
                  {T.zipLabel} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingZip"
                  value={formData.shippingZip}
                  onChange={(e) => updateFormData({ shippingZip: e.target.value })}
                  placeholder={T.zipPlaceholder}
                  className={errors.shippingZip ? 'border-red-500' : ''}
                />
                {errors.shippingZip && (
                  <p className="text-sm text-red-500">{errors.shippingZip}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
