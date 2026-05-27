'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { Campaign } from '@/types/database'
import KanbanColumn from './KanbanColumn'
import CampaignCard from './CampaignCard'

interface KanbanBoardProps {
  campaigns: Campaign[]
  onSelectCampaign: (id: string) => void
  onUpdateStatus: (id: string, status: 'pending_review' | 'approved' | 'published') => void
}

export default function KanbanBoard({ campaigns, onSelectCampaign, onUpdateStatus }: KanbanBoardProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  // Sensor: distance:10 means the pointer must move 10px before drag activates.
  // A normal click (< 10px movement) will NOT activate drag, so onClick fires cleanly.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const columns: { id: 'pending_review' | 'approved' | 'published'; title: string; color: string }[] = [
    {
      id: 'pending_review',
      title: 'Pendiente de Revisión',
      color: 'border-t-amber-500 bg-amber-500/5',
    },
    {
      id: 'approved',
      title: 'Aprobado',
      color: 'border-t-emerald-500 bg-emerald-500/5',
    },
    {
      id: 'published',
      title: 'Publicado',
      color: 'border-t-blue-500 bg-blue-500/5',
    },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)

    if (!over) return

    const campaignId = active.id as string
    const targetStatus = over.id as 'pending_review' | 'approved' | 'published'

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign && campaign.status !== targetStatus) {
      onUpdateStatus(campaignId, targetStatus)
    }
  }

  const handleDragCancel = () => {
    setActiveDragId(null)
  }

  const activeCampaign = activeDragId ? campaigns.find((c) => c.id === activeDragId) : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 h-full items-start overflow-y-auto select-none">
        {columns.map((col) => {
          const colCampaigns = campaigns.filter((c) => c.status === col.id)
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              colorStyle={col.color}
              campaigns={colCampaigns}
              onSelectCampaign={onSelectCampaign}
            />
          )
        })}
      </div>

      {/* DragOverlay renders in a portal — outside all overflow:hidden containers */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        {activeCampaign ? (
          <CampaignCard campaign={activeCampaign} onSelectCampaign={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
