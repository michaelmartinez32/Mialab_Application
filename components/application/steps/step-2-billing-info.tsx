'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationFormData } from '@/lib/form-types'
import { US_STATES } from '@/lib/form-types'

interface Step2Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

export function Step2BillingInfo({ formData, updateFormData, errors }: Step2Props) {
  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Billing Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your billing address and accounts payable contact details.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="billingAddress1" className="text-[#474748]">
            Billing Address Line 1 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="billingAddress1"
            value={formData.billingAddress1}
            onChange={(e) => updateFormData({ billingAddress1: e.target.value })}
            placeholder="Street address"
            className={errors.billingAddress1 ? 'border-red-500' : ''}
          />
          {errors.billingAddress1 && (
            <p className="text-sm text-red-500">{errors.billingAddress1}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingAddress2" className="text-[#474748]">
            Billing Address Line 2 <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="billingAddress2"
            value={formData.billingAddress2}
            onChange={(e) => updateFormData({ billingAddress2: e.target.value })}
            placeholder="Suite, unit, building, floor, etc."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="billingCity" className="text-[#474748]">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billingCity"
              value={formData.billingCity}
              onChange={(e) => updateFormData({ billingCity: e.target.value })}
              placeholder="City"
              className={errors.billingCity ? 'border-red-500' : ''}
            />
            {errors.billingCity && (
              <p className="text-sm text-red-500">{errors.billingCity}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingState" className="text-[#474748]">
              State <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.billingState}
              onValueChange={(value) => updateFormData({ billingState: value })}
            >
              <SelectTrigger className={errors.billingState ? 'border-red-500' : ''}>
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
            {errors.billingState && (
              <p className="text-sm text-red-500">{errors.billingState}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingZip" className="text-[#474748]">
              ZIP Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="billingZip"
              value={formData.billingZip}
              onChange={(e) => updateFormData({ billingZip: e.target.value })}
              placeholder="12345"
              className={errors.billingZip ? 'border-red-500' : ''}
            />
            {errors.billingZip && (
              <p className="text-sm text-red-500">{errors.billingZip}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium text-[#474748]">Accounts Payable Contact</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apContactName" className="text-[#474748]">
                Contact Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apContactName"
                value={formData.apContactName}
                onChange={(e) => updateFormData({ apContactName: e.target.value })}
                placeholder="Accounts payable contact name"
                className={errors.apContactName ? 'border-red-500' : ''}
              />
              {errors.apContactName && (
                <p className="text-sm text-red-500">{errors.apContactName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apEmail" className="text-[#474748]">
                Contact Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apEmail"
                type="email"
                value={formData.apEmail}
                onChange={(e) => updateFormData({ apEmail: e.target.value })}
                placeholder="ap@practice.com"
                className={errors.apEmail ? 'border-red-500' : ''}
              />
              {errors.apEmail && (
                <p className="text-sm text-red-500">{errors.apEmail}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
