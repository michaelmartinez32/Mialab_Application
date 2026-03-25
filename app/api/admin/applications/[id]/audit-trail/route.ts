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
  // In production, add admin authentication here
  // const session = await getAdminSession(request)
  // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    // Verify application exists
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('id, status, practice_name')
      .eq('id', id)
      .single()

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Fetch audit trail
    const { data: auditTrail, error: auditError } = await supabase
      .from('application_audit_trail')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: true })

    if (auditError) {
      console.error('Error fetching audit trail:', auditError)
      return NextResponse.json({ error: 'Failed to fetch audit trail' }, { status: 500 })
    }

    return NextResponse.json({
      applicationId: id,
      practiceName: application.practice_name,
      status: application.status,
      auditTrail: auditTrail.map(entry => ({
        id: entry.id,
        action: entry.action,
        actionDetails: entry.action_details,
        ipAddress: entry.ip_address,
        userAgent: entry.user_agent,
        timestamp: entry.created_at,
      })),
    })

  } catch (error) {
    console.error('Error fetching audit trail:', error)
    return NextResponse.json({ error: 'Failed to fetch audit trail' }, { status: 500 })
  }
}
