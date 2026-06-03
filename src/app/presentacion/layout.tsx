import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MarkeThink — Presentación TFG',
  description: 'Presentación del Proyecto Integrado: Plataforma de Automatización Agéntica de Marketing Digital',
}

export default function PresentacionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="!bg-[#0a0a1a] !text-white">
      {children}
    </div>
  )
}
