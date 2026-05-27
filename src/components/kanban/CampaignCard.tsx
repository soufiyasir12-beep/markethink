'use client'

import { useDraggable } from '@dnd-kit/core'
import { Campaign } from '@/types/database'

interface CampaignCardProps {
  campaign: Campaign
  onSelectCampaign: (id: string) => void
  isDragOverlay?: boolean
}

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

/** Pure visual card content — used both for the real card and the DragOverlay copy */
function CardContent({ campaign, isOverlay = false }: { campaign: Campaign; isOverlay?: boolean }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none ${
        isOverlay ? 'drag-overlay-card' : ''
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
        <h4 className="font-bold text-slate-800 text-sm tracking-tight">
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

export default function CampaignCard({ campaign, onSelectCampaign, isDragOverlay = false }: CampaignCardProps) {
  // If this is the overlay copy rendered inside <DragOverlay>, skip all drag hooks
  if (isDragOverlay) {
    return <CardContent campaign={campaign} isOverlay />
  }

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: campaign.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => {
        // PointerSensor with distance:10 ensures that if onClick fires,
        // the pointer did NOT move enough to activate a drag.
        if (!isDragging) {
          onSelectCampaign(campaign.id)
        }
      }}
      className={`group cursor-grab active:cursor-grabbing transition-opacity duration-150 ${
        isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      }`}
      style={isDragging ? { pointerEvents: 'none' } : undefined}
    >
      <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all select-none`}>
        <div className="flex flex-col gap-2">
          {/* Brand Name & Date */}
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
            <span className="px-2 py-0.5 bg-slate-100 rounded-full font-bold uppercase tracking-wider text-slate-600">
              {campaign.brand_name}
            </span>
            <span>{new Date(campaign.created_at).toLocaleDateString('es-ES')}</span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
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
    </div>
  )
}
