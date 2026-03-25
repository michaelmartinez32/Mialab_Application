'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ApplicationFormData } from '@/lib/form-types'

interface Step5Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

export function Step5OrderingPreferences({ formData, updateFormData, errors }: Step5Props) {
  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Ordering Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Let us know how your practice will submit orders to Mialab.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[#474748]">
            How will your practice primarily submit orders to Mialab? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.orderingMethod}
            onValueChange={(value) => updateFormData({ orderingMethod: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="mialab-portal" id="order-mialab" />
              <Label htmlFor="order-mialab" className="cursor-pointer font-normal">
                <span className="font-medium">Mialab Online Ordering Portal</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use our dedicated online portal for order submission
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="visionweb" id="order-visionweb" />
              <Label htmlFor="order-visionweb" className="cursor-pointer font-normal">
                <span className="font-medium">VisionWeb</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit orders through VisionWeb integration
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="other-integration" id="order-other" />
              <Label htmlFor="order-other" className="cursor-pointer font-normal">
                <span className="font-medium">Other Integration</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use a different practice management system or integration
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="not-sure" id="order-not-sure" />
              <Label htmlFor="order-not-sure" className="cursor-pointer font-normal">
                <span className="font-medium">Not Sure Yet</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll help you decide the best option for your practice
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
              Describe your ordering method <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="otherOrderingMethod"
              value={formData.otherOrderingMethod}
              onChange={(e) => updateFormData({ otherOrderingMethod: e.target.value })}
              placeholder="Please describe your preferred ordering method or integration..."
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
