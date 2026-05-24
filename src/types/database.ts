export interface Campaign {
  id: string
  title: string
  brand_name: string
  briefing: string | null
  status: 'pending_review' | 'approved' | 'published'
  created_at: string
  marketing_assets?: MarketingAsset[]
}

export interface MarketingAsset {
  id: string
  campaign_id: string
  asset_type: 'landing_page' | 'reel_vertical' | 'banner' | 'yt_long'
  title: string | null
  copy_text: string | null
  drive_url: string | null
  vercel_url: string | null
  created_at: string
}
