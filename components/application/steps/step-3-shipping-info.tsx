'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationFormData, AdditionalLocation } from '@/lib/form-types'
import { US_STATES } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step3Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

const EMPTY_LOCATION: AdditionalLocation = {
  sameBusinessName: true,
  locationName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  contactPerson: '',
  phone: '',
  email: '',
}

export function Step3ShippingInfo({ formData, updateFormData, errors, lang }: Step3Props) {
  const T = translations[lang].step3
  const ML = T.multipleLocations

  const handleMultipleLocationsChange = (value: string) => {
    if (value === 'yes') {
      updateFormData({
        hasMultipleLocations: 'yes',
        additionalLocations:
          formData.additionalLocations && formData.additionalLocations.length > 0
            ? formData.additionalLocations
            : [{ ...EMPTY_LOCATION }],
      })
    } else {
      updateFormData({ hasMultipleLocations: 'no', additionalLocations: [] })
    }
  }

  const addLocation = () => {
    updateFormData({
      additionalLocations: [...(formData.additionalLocations || []), { ...EMPTY_LOCATION }],
    })
  }

  const removeLocation = (index: number) => {
    const updated = (formData.additionalLocations || []).filter((_, i) => i !== index)
    updateFormData({ additionalLocations: updated })
  }

  const updateLocation = (
    index: number,
    field: keyof AdditionalLocation,
    value: string | boolean
  ) => {
    const updated = (formData.additionalLocations || []).map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    )
    updateFormData({ additionalLocations: updated })
  }

  return (
    <>
      {/* ── SHIPPING INFORMATION (unchanged) ─────────────────────────────── */}
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

      {/* ── MULTIPLE LOCATIONS ───────────────────────────────────────────── */}
      <Card className="premium-card border-0 mt-6">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold text-[#b40000]">
            {ML.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Yes / No question */}
          <div className="space-y-2">
            <Label className="text-[#474748]">{ML.question}</Label>
            <RadioGroup
              value={formData.hasMultipleLocations}
              onValueChange={handleMultipleLocationsChange}
              className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            >
              <div className="flex h-9 items-center space-x-3 rounded-md border px-3 transition-colors hover:bg-gray-50">
                <RadioGroupItem value="yes" id="multi-loc-yes" />
                <Label htmlFor="multi-loc-yes" className="cursor-pointer font-normal">
                  {ML.yesLabel}
                </Label>
              </div>
              <div className="flex h-9 items-center space-x-3 rounded-md border px-3 transition-colors hover:bg-gray-50">
                <RadioGroupItem value="no" id="multi-loc-no" />
                <Label htmlFor="multi-loc-no" className="cursor-pointer font-normal">
                  {ML.noLabel}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional locations list — only shown when Yes is selected */}
          {formData.hasMultipleLocations === 'yes' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {(formData.additionalLocations || []).map((loc, idx) => (
                <div key={idx} className="rounded-lg border p-4 space-y-4">
                  {/* Location header row */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#474748]">
                      {ML.locationTitle(idx + 1)}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                      onClick={() => removeLocation(idx)}
                    >
                      {ML.removeLabel}
                    </Button>
                  </div>

                  {/* Same business name checkbox */}
                  <div className="flex items-center space-x-3 rounded-lg border bg-gray-50 p-3">
                    <Checkbox
                      id={`loc-same-name-${idx}`}
                      checked={loc.sameBusinessName}
                      onCheckedChange={(checked) =>
                        updateLocation(idx, 'sameBusinessName', checked === true)
                      }
                    />
                    <Label
                      htmlFor={`loc-same-name-${idx}`}
                      className="cursor-pointer font-normal text-[#474748] text-sm"
                    >
                      {ML.sameBusinessNameLabel}
                    </Label>
                  </div>

                  {/* Location name — only if different business name */}
                  {!loc.sameBusinessName && (
                    <div className="space-y-2">
                      <Label className="text-[#474748]">
                        {ML.locationNameLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={loc.locationName}
                        onChange={(e) => updateLocation(idx, 'locationName', e.target.value)}
                        placeholder={ML.locationNamePlaceholder}
                        className={errors[`loc_${idx}_locationName`] ? 'border-red-500' : ''}
                      />
                      {errors[`loc_${idx}_locationName`] && (
                        <p className="text-sm text-red-500">{errors[`loc_${idx}_locationName`]}</p>
                      )}
                    </div>
                  )}

                  {/* Address line 1 */}
                  <div className="space-y-2">
                    <Label className="text-[#474748]">
                      {ML.address1Label} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={loc.address1}
                      onChange={(e) => updateLocation(idx, 'address1', e.target.value)}
                      placeholder={ML.address1Placeholder}
                      className={errors[`loc_${idx}_address1`] ? 'border-red-500' : ''}
                    />
                    {errors[`loc_${idx}_address1`] && (
                      <p className="text-sm text-red-500">{errors[`loc_${idx}_address1`]}</p>
                    )}
                  </div>

                  {/* Address line 2 */}
                  <div className="space-y-2">
                    <Label className="text-[#474748]">
                      {ML.address2Label}{' '}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      value={loc.address2}
                      onChange={(e) => updateLocation(idx, 'address2', e.target.value)}
                      placeholder={ML.address2Placeholder}
                    />
                  </div>

                  {/* City / State / ZIP */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-[#474748]">
                        {ML.cityLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={loc.city}
                        onChange={(e) => updateLocation(idx, 'city', e.target.value)}
                        placeholder={ML.cityPlaceholder}
                        className={errors[`loc_${idx}_city`] ? 'border-red-500' : ''}
                      />
                      {errors[`loc_${idx}_city`] && (
                        <p className="text-sm text-red-500">{errors[`loc_${idx}_city`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#474748]">
                        {ML.stateLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={loc.state}
                        onValueChange={(value) => updateLocation(idx, 'state', value)}
                      >
                        <SelectTrigger
                          className={errors[`loc_${idx}_state`] ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder={ML.statePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`loc_${idx}_state`] && (
                        <p className="text-sm text-red-500">{errors[`loc_${idx}_state`]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#474748]">
                        {ML.zipLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={loc.zip}
                        onChange={(e) => updateLocation(idx, 'zip', e.target.value)}
                        placeholder={ML.zipPlaceholder}
                        className={errors[`loc_${idx}_zip`] ? 'border-red-500' : ''}
                      />
                      {errors[`loc_${idx}_zip`] && (
                        <p className="text-sm text-red-500">{errors[`loc_${idx}_zip`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact / Phone / Email */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-[#474748]">{ML.contactPersonLabel}</Label>
                      <Input
                        value={loc.contactPerson}
                        onChange={(e) => updateLocation(idx, 'contactPerson', e.target.value)}
                        placeholder={ML.contactPersonPlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#474748]">{ML.phoneLabel}</Label>
                      <Input
                        value={loc.phone}
                        onChange={(e) => updateLocation(idx, 'phone', e.target.value)}
                        placeholder={ML.phonePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#474748]">{ML.emailLabel}</Label>
                      <Input
                        type="email"
                        value={loc.email}
                        onChange={(e) => updateLocation(idx, 'email', e.target.value)}
                        placeholder={ML.emailPlaceholder}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Location */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-[#b40000] text-[#b40000] hover:bg-red-50"
                onClick={addLocation}
              >
                {ML.addButton}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
