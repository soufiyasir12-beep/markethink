'use client'

import { Campaign, MarketingAsset } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import AssetCard from './AssetCard'

interface CampaignDrawerProps {
  campaign: Campaign | undefined
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: 'pending_review' | 'approved' | 'published') => void
  onUpdateAssetCopy: (assetId: string, campaignId: string, newCopy: string) => Promise<boolean>
  onPreviewAsset: (asset: MarketingAsset) => void
}

export default function CampaignDrawer({
  campaign,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateAssetCopy,
  onPreviewAsset,
}: CampaignDrawerProps) {
  if (!campaign) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col font-sans"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between min-h-[73px]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
                    {campaign.brand_name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    campaign.status === 'published'
                      ? 'bg-blue-50 border-blue-100 text-blue-700'
                      : campaign.status === 'approved'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                    {campaign.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-1">{campaign.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Campaign Briefing */}
              {campaign.briefing && (
                <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Briefing del Cliente</h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                    {campaign.briefing}
                  </p>
                </div>
              )}

              {/* Marketing Assets Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recursos de Marketing (IA)</h3>
                
                {(!campaign.marketing_assets || campaign.marketing_assets.length === 0) ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center text-slate-400 text-sm font-medium">
                    El orquestador de IA no ha generado ningún asset para esta campaña aún.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaign.marketing_assets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        onUpdateCopy={(newCopy) => onUpdateAssetCopy(asset.id, campaign.id, newCopy)}
                        onPreview={() => onPreviewAsset(asset)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Action Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {campaign.status !== 'approved' && campaign.status !== 'published' && (
                <button
                  onClick={() => onUpdateStatus(campaign.id, 'approved')}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all text-center"
                >
                  Aprobar Campaña completa
                </button>
              )}
              {campaign.status === 'approved' && (
                <button
                  onClick={() => onUpdateStatus(campaign.id, 'published')}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl cursor-pointer transition-colors text-center"
                >
                  Publicar Campaña
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
