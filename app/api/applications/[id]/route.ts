import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: application, error } = await supabase
      .from('applications')
      .select('id, status, practice_name, email, submitted_at, locked_at')
      .eq('id', id)
      .single()

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}

// Prevent modifications to submitted applications
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if application is locked
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('id, status, locked_at')
      .eq('id', id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.locked_at) {
      return NextResponse.json(
        { 
          error: 'Application is locked and cannot be modified',
          message: 'This application has been submitted and signed. To make changes, please submit a new amendment request.',
          lockedAt: application.locked_at
        },
        { status: 403 }
      )
    }

    // If not locked, this would handle draft updates
    // For now, we don't support draft editing via API
    return NextResponse.json(
      { error: 'Draft editing not supported via this endpoint' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}
