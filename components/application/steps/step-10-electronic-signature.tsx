'use client'

import { useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eraser, PenTool, Type } from 'lucide-react'
import type { ApplicationFormData } from '@/lib/form-types'

interface Step10Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  signatureType: 'typed' | 'drawn'
  onSignatureTypeChange: (type: 'typed' | 'drawn') => void
}

export function Step10ElectronicSignature({ 
  formData, 
  updateFormData, 
  errors,
  signatureType,
  onSignatureTypeChange
}: Step10Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>(signatureType === 'typed' ? 'type' : 'draw')
  const [typedSignature, setTypedSignature] = useState('')
  
  useEffect(() => {
    onSignatureTypeChange(signatureMode === 'type' ? 'typed' : 'drawn')
  }, [signatureMode, onSignatureTypeChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = '#474748'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    saveSignature()
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      updateFormData({ signatureData: dataUrl })
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      updateFormData({ signatureData: '' })
    }
    setTypedSignature('')
  }

  const handleTypedSignatureChange = (value: string) => {
    setTypedSignature(value)
    if (value.trim()) {
      updateFormData({ signatureData: `typed:${value}` })
    } else {
      updateFormData({ signatureData: '' })
    }
  }

  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Electronic Signature
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign below to certify that you are authorized to submit this application on behalf of the business.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-[#474748]">
            Signature <span className="text-red-500">*</span>
          </Label>
          
          <Tabs value={signatureMode} onValueChange={(v) => setSignatureMode(v as 'draw' | 'type')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw" className="gap-2">
                <PenTool className="h-4 w-4" />
                Draw Signature
              </TabsTrigger>
              <TabsTrigger value="type" className="gap-2">
                <Type className="h-4 w-4" />
                Type Signature
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="mt-4">
              <div className="space-y-3">
                <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full cursor-crosshair touch-none rounded-lg"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="absolute bottom-4 left-4 right-4 border-t border-gray-300" />
                  <span className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                    Sign above the line
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                  className="gap-2"
                >
                  <Eraser className="h-4 w-4" />
                  Clear Signature
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="type" className="mt-4">
              <div className="space-y-3">
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6">
                  <Input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => handleTypedSignatureChange(e.target.value)}
                    placeholder="Type your full legal name"
                    className="border-0 border-b-2 border-gray-300 bg-transparent text-center text-2xl italic focus-visible:ring-0 focus-visible:border-[#6fcbdb]"
                    style={{ fontFamily: 'cursive' }}
                  />
                </div>
                {typedSignature && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="gap-2"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear Signature
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {errors.signatureData && (
            <p className="text-sm text-red-500">{errors.signatureData}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="printedName" className="text-[#474748]">
              Printed Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="printedName"
              value={formData.printedName}
              onChange={(e) => updateFormData({ printedName: e.target.value })}
              placeholder="Your full legal name"
              className={errors.printedName ? 'border-red-500' : ''}
            />
            {errors.printedName && (
              <p className="text-sm text-red-500">{errors.printedName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#474748]">
              Title / Position <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Owner, Office Manager"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signatureDate" className="text-[#474748]">
              Date
            </Label>
            <Input
              id="signatureDate"
              value={formData.signatureDate}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By signing above, you certify that you are authorized to submit this application on behalf of the business and that all information provided is true and accurate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
