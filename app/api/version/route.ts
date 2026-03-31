import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    version: 'build-test-1',
    source: 'Mialab_Application',
    branch: 'main',
    vercelProject: 'mialab-application',
    testPanelInstalled: true,
    testPanelShortcuts: ['Ctrl+Shift+9', 'Shift+T x3 (within 1.5s)', '?showTestPanel=1'],
    testRoutes: ['/api/internal/test-pdf', '/api/internal/test-email'],
    timestamp: new Date().toISOString(),
  })
}
