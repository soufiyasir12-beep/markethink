'use client'

import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { Campaign } from '@/types/database'
import KanbanColumn from './KanbanColumn'

interface KanbanBoardProps {
  campaigns: Campaign[]
  onSelectCampaign: (id: string) => void
  onUpdateStatus: (id: string, status: 'pending_review' | 'approved' | 'published') => void
}

export default function KanbanBoard({ campaigns, onSelectCampaign, onUpdateStatus }: KanbanBoardProps) {
  // Sensor for handling dragging and clicks gracefully
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const campaignId = active.id as string
    const targetStatus = over.id as 'pending_review' | 'approved' | 'published'

    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign && campaign.status !== targetStatus) {
      onUpdateStatus(campaignId, targetStatus)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
    </DndContext>
  )
}
