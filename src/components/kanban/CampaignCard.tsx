'use client'

import { useDraggable } from '@dnd-kit/core'
import { Campaign } from '@/types/database'

interface CampaignCardProps {
  campaign: Campaign
  onSelectCampaign: (id: string) => void
}

export default function CampaignCard({ campaign, onSelectCampaign }: CampaignCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: campaign.id,
  })

  // Style dynamic transform adjustments
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  // Map asset types to custom stylized badges
  const getAssetBadgeColor = (type: string) => {
    switch (type) {
      case 'landing_page':
        return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'reel_vertical':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'banner':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'yt_long':
        return 'bg-red-50 text-red-700 border-red-100'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  const getAssetLabel = (type: string) => {
    switch (type) {
      case 'landing_page':
        return 'Web'
      case 'reel_vertical':
        return 'Reel'
      case 'banner':
        return 'Banner'
      case 'yt_long':
        return 'YouTube'
      default:
        return type
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-40 dnd-dragging' : ''
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Brand Name & Date */}
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
          <span className="px-2 py-0.5 bg-slate-100 rounded-full font-bold uppercase tracking-wider text-slate-600">
            {campaign.brand_name}
          </span>
          <span>{new Date(campaign.created_at).toLocaleDateString('es-ES')}</span>
        </div>

        {/* Title */}
        <h4
          onClick={(e) => {
            // Prevent drawer opening during drags
            e.stopPropagation()
            onSelectCampaign(campaign.id)
          }}
          {...listeners}
          className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-indigo-600 transition-colors cursor-pointer"
        >
          {campaign.title}
        </h4>

        {/* Nested Marketing Assets indicator badges */}
        {campaign.marketing_assets && campaign.marketing_assets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {campaign.marketing_assets.map((asset) => (
              <span
                key={asset.id}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getAssetBadgeColor(
                  asset.asset_type
                )}`}
              >
                {getAssetLabel(asset.asset_type)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
