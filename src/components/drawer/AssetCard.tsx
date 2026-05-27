'use client'

import { useState } from 'react'
import { MarketingAsset } from '@/types/database'
import { getDriveImageUrl } from '@/lib/utils/drive'

interface AssetCardProps {
  asset: MarketingAsset
  onUpdateCopy: (newCopy: string) => Promise<boolean>
  onPreview: () => void
  onDeleteAsset: (id: string) => Promise<void>
}

export default function AssetCard({ asset, onUpdateCopy, onPreview, onDeleteAsset }: AssetCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [copyText, setCopyText] = useState(asset.copy_text || '')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const success = await onUpdateCopy(copyText)
    if (success) {
      setIsEditing(false)
    }
    setSaving(false)
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'landing_page':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )
      case 'reel_vertical':
        return (
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'banner':
        return (
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'yt_long':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getAssetTypeName = (type: string) => {
    switch (type) {
      case 'landing_page':
        return 'Página Web (Landing)'
      case 'reel_vertical':
        return 'Instagram Reel / TikTok'
      case 'banner':
        return 'Banner Publicitario'
      case 'yt_long':
        return 'Video de YouTube (Largo)'
      default:
        return type
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
      {/* Title & Icon Header */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between min-h-[62px]">
        {showDeleteConfirm ? (
          <div className="flex items-center justify-between w-full animate-fade-in">
            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              ¿Eliminar recurso?
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-1 px-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-md text-[10px] font-semibold cursor-pointer transition-colors"
              >
                No
              </button>
              <button
                onClick={async () => {
                  await onDeleteAsset(asset.id)
                  setShowDeleteConfirm(false)
                }}
                className="py-1 px-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-[10px] font-semibold cursor-pointer transition-colors"
              >
                Sí
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-200/50">
                {getAssetIcon(asset.asset_type)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm tracking-tight">{asset.title || 'Recurso sin título'}</h4>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  {getAssetTypeName(asset.asset_type)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPreview}
                className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Previsualizar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition-all flex items-center justify-center"
                title="Eliminar recurso"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Copy Text Editor */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Copy / Descripción</span>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={copyText}
                onChange={(e) => setCopyText(e.target.value)}
                rows={4}
                className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-none rounded-xl p-3 leading-relaxed resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setCopyText(asset.copy_text || '')
                    setIsEditing(false)
                  }}
                  className="py-1.5 px-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-slate-600 bg-slate-50 border border-transparent hover:border-slate-200/50 hover:bg-slate-50/80 transition-all rounded-xl p-3 leading-relaxed italic cursor-pointer whitespace-pre-wrap select-text"
              title="Haz clic para editar"
            >
              {asset.copy_text || 'Haz clic para añadir una descripción o copy.'}
            </p>
          )}
        </div>

        {/* Thumbnail or Vercel URL preview trigger */}
        {asset.asset_type === 'banner' && asset.drive_url && (
          <div
            onClick={onPreview}
            className="w-full aspect-video relative rounded-xl overflow-hidden border border-slate-200/60 bg-slate-100/50 flex items-center justify-center cursor-pointer group mt-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getDriveImageUrl(asset.drive_url)}
              alt={asset.title || 'Banner generated thumbnail'}
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              <span className="bg-white/95 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-800 shadow-md">
                Ver tamaño completo
              </span>
            </div>
          </div>
        )}

        {asset.asset_type === 'landing_page' && asset.vercel_url && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-xl p-3 mt-1 select-none">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Despliegue Vercel</span>
              <span className="text-xs font-semibold text-slate-600 truncate mt-0.5">{asset.vercel_url}</span>
            </div>
            <a
              href={asset.vercel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-slate-200/50 border border-slate-200 rounded-lg text-indigo-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
