'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface SidebarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  userEmail?: string
}

export default function Sidebar({ currentTab, setCurrentTab, userEmail }: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión: ' + error.message)
    } else {
      toast.success('Sesión cerrada con éxito')
      router.push('/login')
    }
  }

  const menuItems = [
    {
      id: 'kanban',
      label: 'Tablero Kanban',
      description: 'Gestión visual de campañas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
    },
    {
      id: 'campaigns',
      label: 'Campañas (Lista)',
      description: 'Vista tabular de campañas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'assets',
      label: 'Biblioteca de Assets',
      description: 'Archivos generados por IA',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Configuración',
      description: 'Ajustes de la plataforma',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
        </svg>
      ),
    },
  ]

  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-screen bg-white border-r border-slate-200 shadow-sm shrink-0 select-none relative z-20"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 min-h-[73px]">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold text-sm tracking-wide shadow-md shadow-indigo-500/20">
              MT
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-base tracking-tight block">
                Marke<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">think</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block -mt-0.5">
                Agency OS
              </span>
            </div>
          </motion.div>
        )}

        {isCollapsed && (
          <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold text-sm">
            MT
          </div>
        )}

        {/* Collapse Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expand Button for Collapsed Mode */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute top-5 -right-3 p-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 shadow-sm cursor-pointer z-30"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Menu Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all cursor-pointer group text-left relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50 to-violet-50/50 text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal group-hover:text-slate-500 transition-colors">
                    {item.description}
                  </span>
                </div>
              )}

              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />
              )}
            </button>
          )
        })}
      </div>

      {/* Sidebar Footer (User Info & Logout) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {!isCollapsed ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 border border-indigo-200/50 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner uppercase">
                {userEmail ? userEmail.charAt(0) : 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-700 truncate">Agente de Cuenta</span>
                <span className="text-[10px] text-slate-400 truncate leading-none mt-0.5">{userEmail || 'anonimo@agencia.com'}</span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-2 px-3 hover:bg-red-50 hover:text-red-600 border border-dashed border-slate-200 hover:border-red-200 text-slate-500 font-medium text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 border border-indigo-200/50 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner uppercase">
              {userEmail ? userEmail.charAt(0) : 'A'}
            </div>
            <button
              onClick={handleSignOut}
              title="Cerrar Sesión"
              className="p-2 hover:bg-red-50 hover:text-red-600 border border-dashed border-slate-200 hover:border-red-200 text-slate-400 rounded-xl cursor-pointer transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
