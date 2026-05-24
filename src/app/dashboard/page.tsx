import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch campaigns and nested assets
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      *,
      marketing_assets (
        *
      )
    `)
    .order('created_at', { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <DashboardShell
      initialCampaigns={campaigns || []}
      userEmail={user?.email || 'agente@markethink.com'}
    />
  )
}
