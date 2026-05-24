'use client'

import { useDroppable } from '@dnd-kit/core'
import { Campaign } from '@/types/database'
import CampaignCard from './CampaignCard'
import { motion, AnimatePresence } from 'framer-motion'

interface KanbanColumnProps {
  id: string
  title: string
  colorStyle: string
  campaigns: Campaign[]
  onSelectCampaign: (id: string) => void
}

export default function KanbanColumn({ id, title, colorStyle, campaigns, onSelectCampaign }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col max-h-[80vh] border border-slate-200/60 rounded-2xl p-4 transition-all w-full ${colorStyle} ${
        isOver ? 'ring-2 ring-indigo-500/20 border-indigo-400 bg-slate-100/50' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        <span className="px-2 py-0.5 bg-slate-200/50 text-slate-600 font-bold text-xs rounded-md shadow-sm">
          {campaigns.length}
        </span>
      </div>

      {/* Droppable Area / Cards container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[400px]">
        <AnimatePresence initial={false}>
          {campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl py-12 text-center text-slate-400 text-xs font-semibold"
            >
              Arrastra una campaña aquí
            </motion.div>
          ) : (
            campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <CampaignCard campaign={campaign} onSelectCampaign={onSelectCampaign} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
