'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import CampaignDrawer from '@/components/drawer/CampaignDrawer'
import PreviewModal from '@/components/preview/PreviewModal'
import { createClient } from '@/lib/supabase/client'
import { Campaign, MarketingAsset } from '@/types/database'
import toast from 'react-hot-toast'

interface DashboardShellProps {
  initialCampaigns: Campaign[]
  userEmail: string
}

export default function DashboardShell({ initialCampaigns, userEmail }: DashboardShellProps) {
  const [currentTab, setCurrentTab] = useState('kanban')
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [previewAsset, setPreviewAsset] = useState<MarketingAsset | null>(null)
  const [confirmDeleteAssetId, setConfirmDeleteAssetId] = useState<string | null>(null)

  const supabase = createClient()

  // Realtime subscription configuration
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newCampaign = payload.new as Campaign
            newCampaign.marketing_assets = []
            setCampaigns((prev) => [newCampaign, ...prev])
            toast.success(`Nueva campaña: "${newCampaign.title}" creada por la IA`, {
              icon: '🚀',
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedCampaign = payload.new as Campaign
            setCampaigns((prev) =>
              prev.map((c) =>
                c.id === updatedCampaign.id
                  ? { ...c, ...updatedCampaign }
                  : c
              )
            )
            toast.success(`Campaña "${updatedCampaign.title}" actualizada`, {
              icon: '🔄',
            })
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setCampaigns((prev) => prev.filter((c) => c.id !== deletedId))
            toast.error(`Campaña eliminada`, {
              icon: '🗑️',
            })
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'marketing_assets' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAsset = payload.new as MarketingAsset
            setCampaigns((prev) =>
              prev.map((c) => {
                if (c.id === newAsset.campaign_id) {
                  const assets = c.marketing_assets || []
                  if (!assets.some((a) => a.id === newAsset.id)) {
                    return { ...c, marketing_assets: [...assets, newAsset] }
                  }
                }
                return c
              })
            )
            toast.success(`Nuevo asset generado: ${newAsset.asset_type.replace('_', ' ')}`, {
              icon: '✨',
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedAsset = payload.new as MarketingAsset
            setCampaigns((prev) =>
              prev.map((c) => {
                if (c.id === updatedAsset.campaign_id) {
                  const assets = c.marketing_assets || []
                  return {
                    ...c,
                    marketing_assets: assets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)),
                  }
                }
                return c
              })
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedAsset = payload.old as { id: string; campaign_id: string }
            setCampaigns((prev) =>
              prev.map((c) => {
                const assets = c.marketing_assets || []
                return {
                  ...c,
                  marketing_assets: assets.filter((a) => a.id !== deletedAsset.id),
                }
              })
            )
          }
        }
      )
      .subscribe((status) => {
        setIsRealtimeConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId)

  // Toggle campaign status
  const handleUpdateCampaignStatus = async (id: string, newStatus: 'pending_review' | 'approved' | 'published') => {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast.error('Error al actualizar estado: ' + error.message)
    } else {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      toast.success(`Campaña marcada como ${newStatus.replace('_', ' ')}`)
    }
  }

  // Update asset copy
  const handleUpdateAssetCopy = async (assetId: string, campaignId: string, newCopy: string) => {
    const { error } = await supabase
      .from('marketing_assets')
      .update({ copy_text: newCopy })
      .eq('id', assetId)

    if (error) {
      toast.error('Error al guardar copy: ' + error.message)
      return false
    } else {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === campaignId) {
            const assets = c.marketing_assets || []
            return {
              ...c,
              marketing_assets: assets.map((a) => (a.id === assetId ? { ...a, copy_text: newCopy } : a)),
            }
          }
          return c
        })
      )
      toast.success('Copy actualizado con éxito')
      return true
    }
  }

  // Delete campaign
  const handleDeleteCampaign = async (campaignId: string) => {
    setSelectedCampaignId(null)

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)

    if (error) {
      toast.error('Error al eliminar campaña: ' + error.message)
    } else {
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId))
      toast.success('Campaña eliminada correctamente')
    }
  }

  // Delete asset
  const handleDeleteAsset = async (assetId: string) => {
    const { error } = await supabase
      .from('marketing_assets')
      .delete()
      .eq('id', assetId)

    if (error) {
      toast.error('Error al eliminar recurso: ' + error.message)
    } else {
      setCampaigns((prev) =>
        prev.map((c) => {
          const assets = c.marketing_assets || []
          return {
            ...c,
            marketing_assets: assets.filter((a) => a.id !== assetId),
          }
        })
      )
      toast.success('Recurso eliminado correctamente')
    }
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'kanban':
        return (
          <KanbanBoard
            campaigns={campaigns}
            onSelectCampaign={setSelectedCampaignId}
            onUpdateStatus={handleUpdateCampaignStatus}
          />
        )
      case 'campaigns':
        return (
          <div className="p-8 overflow-y-auto h-full max-w-7xl mx-auto w-full">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Campaña</th>
                    <th className="px-6 py-4">Marca</th>
                    <th className="px-6 py-4">Assets</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Creado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No hay campañas creadas aún.
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCampaignId(c.id)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900">{c.title}</td>
                        <td className="px-6 py-4 text-slate-500">{c.brand_name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">
                            {c.marketing_assets?.length || 0} assets
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            c.status === 'published'
                              ? 'bg-blue-50 text-blue-700'
                              : c.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(c.created_at).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'assets':
        const allAssets = campaigns.flatMap((c) =>
          (c.marketing_assets || []).map((a) => ({ ...a, campaignTitle: c.title, brandName: c.brand_name }))
        )
        return (
          <div className="p-8 overflow-y-auto h-full max-w-7xl mx-auto w-full">
            {allAssets.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                No hay assets generados para las campañas actuales.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
                  >
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          {asset.asset_type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(asset.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-2 truncate">{asset.title || 'Asset sin título'}</h4>
                      <p className="text-xs text-slate-400 font-medium">Campaña: {asset.campaignTitle} ({asset.brandName})</p>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <p className="text-xs text-slate-500 font-medium line-clamp-3 italic">
                        {asset.copy_text || 'Sin copy generado.'}
                      </p>
                      <div className="flex gap-2">
                        {confirmDeleteAssetId === asset.id ? (
                          <div className="flex-1 flex gap-2 items-center bg-red-50/50 border border-red-200 rounded-xl p-2 animate-fade-in w-full">
                            <span className="text-[10px] font-bold text-red-600 flex-1 px-1">¿Eliminar recurso?</span>
                            <button
                              onClick={() => setConfirmDeleteAssetId(null)}
                              className="py-1 px-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors"
                            >
                              No
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteAsset(asset.id)
                                setConfirmDeleteAssetId(null)
                              }}
                              className="py-1 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-colors"
                            >
                              Sí
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setPreviewAsset(asset)}
                              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Previsualizar
                            </button>
                            {asset.vercel_url && (
                              <a
                                href={asset.vercel_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Visitar Sitio
                              </a>
                            )}
                            <button
                              onClick={() => setConfirmDeleteAssetId(asset.id)}
                              className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer transition-all flex items-center justify-center"
                              title="Eliminar recurso"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'settings':
        return (
          <div className="p-8 overflow-y-auto h-full max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Credenciales de Supabase</h3>
              <div className="space-y-4 text-sm font-semibold">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Proyecto URL</span>
                  <input
                    type="text"
                    readOnly
                    value="https://iiqnfmagxwbofgwkuopa.supabase.co"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-sm mt-1 outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Clave Anon (Client-side)</span>
                  <input
                    type="text"
                    readOnly
                    value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-sm mt-1 outline-none font-mono"
                  />
                </div>
              </div>
            </div>


          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} userEmail={userEmail} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header currentTab={currentTab} isRealtimeConnected={isRealtimeConnected} />
        <div className="flex-1 overflow-hidden bg-slate-50/50">
          {renderContent()}
        </div>
      </div>

      {/* Campaign Details Drawer */}
      <CampaignDrawer
        campaign={selectedCampaign}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
        onUpdateStatus={handleUpdateCampaignStatus}
        onUpdateAssetCopy={handleUpdateAssetCopy}
        onPreviewAsset={setPreviewAsset}
        onDeleteCampaign={handleDeleteCampaign}
        onDeleteAsset={handleDeleteAsset}
      />

      {/* Preview Modal */}
      <PreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
      />
    </div>
  )
}
