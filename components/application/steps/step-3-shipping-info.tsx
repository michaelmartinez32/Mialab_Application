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

interface Step3Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

export function Step3ShippingInfo({ formData, updateFormData, errors }: Step3Props) {
  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Shipping Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Where should we ship your orders?
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
            Shipping address is the same as billing address
          </Label>
        </div>

        {!formData.shippingSameAsBilling && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="shippingAddress1" className="text-[#474748]">
                Shipping Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingAddress1"
                value={formData.shippingAddress1}
                onChange={(e) => updateFormData({ shippingAddress1: e.target.value })}
                placeholder="Street address"
                className={errors.shippingAddress1 ? 'border-red-500' : ''}
              />
              {errors.shippingAddress1 && (
                <p className="text-sm text-red-500">{errors.shippingAddress1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress2" className="text-[#474748]">
                Address Line 2 <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="shippingAddress2"
                value={formData.shippingAddress2}
                onChange={(e) => updateFormData({ shippingAddress2: e.target.value })}
                placeholder="Suite, unit, building, floor, etc."
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="shippingCity" className="text-[#474748]">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingCity"
                  value={formData.shippingCity}
                  onChange={(e) => updateFormData({ shippingCity: e.target.value })}
                  placeholder="City"
                  className={errors.shippingCity ? 'border-red-500' : ''}
                />
                {errors.shippingCity && (
                  <p className="text-sm text-red-500">{errors.shippingCity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingState" className="text-[#474748]">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.shippingState}
                  onValueChange={(value) => updateFormData({ shippingState: value })}
                >
                  <SelectTrigger className={errors.shippingState ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
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
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingZip"
                  value={formData.shippingZip}
                  onChange={(e) => updateFormData({ shippingZip: e.target.value })}
                  placeholder="12345"
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
