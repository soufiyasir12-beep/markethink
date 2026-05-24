'use client'

interface HeaderProps {
  currentTab: string
  isRealtimeConnected: boolean
}

export default function Header({ currentTab, isRealtimeConnected }: HeaderProps) {
  const getTitle = () => {
    switch (currentTab) {
      case 'kanban':
        return 'Tablero Kanban'
      case 'campaigns':
        return 'Campañas'
      case 'assets':
        return 'Biblioteca de Assets'
      case 'settings':
        return 'Configuración'
      default:
        return 'Dashboard'
    }
  }

  const getSubtitle = () => {
    switch (currentTab) {
      case 'kanban':
        return 'Organiza, revisa y aprueba el flujo de campañas de marketing'
      case 'campaigns':
        return 'Listado estructurado de todas las campañas activas'
      case 'assets':
        return 'Contenido multimedia generado por la IA en tiempo real'
      case 'settings':
        return 'Ajustes del proyecto y tokens de automatización'
      default:
        return 'Plataforma Markethink'
    }
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 min-h-[73px] select-none">
      <div className="flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Markethink</span>
          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-indigo-500">{getTitle()}</span>
        </div>
        
        {/* Title */}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight mt-0.5">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Realtime Status Indicator */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          isRealtimeConnected 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <span className={`w-2 h-2 rounded-full relative flex ${isRealtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}>
            {isRealtimeConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
          </span>
          <span>{isRealtimeConnected ? 'En Tiempo Real' : 'Conectando...'}</span>
        </div>
      </div>
    </header>
  )
}
