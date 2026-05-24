'use client'

import { MarketingAsset } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { getDriveImageUrl, getDriveVideoUrl } from '@/lib/utils/drive'

interface PreviewModalProps {
  asset: MarketingAsset | null
  isOpen: boolean
  onClose: () => void
}

export default function PreviewModal({ asset, isOpen, onClose }: PreviewModalProps) {
  if (!asset) return null

  const getAssetTypeName = (type: string) => {
    switch (type) {
      case 'landing_page':
        return 'Página Web (Landing)'
      case 'reel_vertical':
        return 'Instagram Reel / TikTok'
      case 'banner':
        return 'Banner Publicitario'
      case 'yt_long':
        return 'Video de YouTube'
      default:
        return type
    }
  }

  const renderPreviewContent = () => {
    switch (asset.asset_type) {
      case 'landing_page':
        if (!asset.vercel_url) {
          return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-semibold text-sm">
              <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No hay una dirección URL de Vercel configurada para este sitio.
            </div>
          )
        }
        return (
          <iframe
            src={asset.vercel_url}
            title={asset.title || 'Landing page preview'}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        )
      case 'banner':
        if (!asset.drive_url) {
          return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-semibold text-sm">
              Falta el enlace de Google Drive.
            </div>
          )
        }
        return (
          <div className="flex items-center justify-center w-full h-full p-6 bg-slate-900/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getDriveImageUrl(asset.drive_url)}
              alt={asset.title || 'Banner preview'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-700"
            />
          </div>
        )
      case 'reel_vertical':
      case 'yt_long':
        if (!asset.drive_url) {
          return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-semibold text-sm">
              Falta el enlace del video de Google Drive.
            </div>
          )
        }
        const isReel = asset.asset_type === 'reel_vertical'
        return (
          <div className="flex items-center justify-center w-full h-full p-6 bg-slate-950">
            <video
              src={getDriveVideoUrl(asset.drive_url)}
              controls
              autoPlay
              className={`rounded-xl shadow-2xl border border-slate-800 object-contain ${
                isReel ? 'h-full max-h-[85vh] aspect-[9/16]' : 'w-full max-w-4xl aspect-video'
              }`}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Modal Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative z-10 w-full px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between min-h-[73px]"
          >
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                {getAssetTypeName(asset.asset_type)}
              </span>
              <h2 className="text-base font-bold tracking-tight text-white mt-0.5">{asset.title || 'Recurso sin título'}</h2>
            </div>
            
            <div className="flex items-center gap-3">
              {asset.vercel_url && asset.asset_type === 'landing_page' && (
                <a
                  href={asset.vercel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  Abrir en pestaña nueva
                </a>
              )}
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 border border-white/20 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Modal Preview Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden"
          >
            {renderPreviewContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
