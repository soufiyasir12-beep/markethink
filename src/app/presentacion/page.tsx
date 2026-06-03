'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────── Slide data ─────────── */
interface Slide {
  id: string
  title: string
  subtitle?: string
  content: React.ReactNode
  bg?: string            // extra Tailwind bg utility
  accent?: string        // gradient accent colour
}

/* ─────────── Icon components ─────────── */
const ChevronLeft  = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>

/* ─────────── Reusable sub-components ─────────── */
function Badge({ children, color = 'purple', onClick }: { children: React.ReactNode; color?: string; onClick?: () => void }) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    blue:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
    rose:   'bg-rose-500/20 text-rose-300 border-rose-500/30',
    cyan:   'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  }
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${colors[color] ?? colors.purple} ${onClick ? 'cursor-pointer hover:bg-emerald-500/30 hover:text-white transition-all duration-200' : ''}`}
    >
      {children}
    </span>
  )
}

function FeatureCard({ icon, title, desc, delay = 0, onClick }: { icon: string; title: string; desc: string; delay?: number; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:border-purple-500/40 transition-colors ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}`}
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </motion.div>
  )
}

function TimelineStep({ step, title, desc, delay = 0, onClick }: { step: string; title: string; desc: string; delay?: number; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`flex gap-4 p-2 rounded-xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:bg-white/5 hover:translate-x-1' : ''}`}
    >
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
          {step}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/40 to-transparent" />
      </div>
      <div className="pb-8">
        <h4 className="font-bold text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-400">{desc}</p>
      </div>
    </motion.div>
  )
}

function StatCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="text-center"
    >
      <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </motion.div>
  )
}

function SecurityItem({ icon, title, desc, delay = 0, onClick }: { icon: string; title: string; desc: string; delay?: number; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/40' : ''}`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-semibold text-emerald-300">{title}</h4>
        <p className="mt-1 text-xs text-slate-400">{desc}</p>
      </div>
    </motion.div>
  )
}

function TableRow({ cells, header = false, delay = 0, onClick }: { cells: string[]; header?: boolean; delay?: number; onClick?: () => void }) {
  const Tag = header ? 'th' : 'td'
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      onClick={onClick}
      className={header ? 'border-b border-white/10' : `border-b border-white/5 ${onClick ? 'cursor-pointer hover:bg-emerald-500/15 hover:text-emerald-200' : 'hover:bg-white/5'} transition-all duration-200`}
    >
      {cells.map((c, i) => (
        <Tag key={i} className={`px-4 py-2.5 text-left text-sm ${header ? 'font-semibold text-purple-300' : 'text-slate-300'}`}>
          {c}
        </Tag>
      ))}
    </motion.tr>
  )
}

/* ─────────── SLIDES definition ─────────── */
function useSlides({ onTailscaleClick, onDockerClick }: { onTailscaleClick: () => void; onDockerClick: () => void }): Slide[] {
  return [
    /* 0 ─ PORTADA */
    {
      id: 'portada',
      title: '',
      content: (
        <div className="flex flex-col items-center justify-center text-center gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <img
              src="/presentacion/hero.png"
              alt="Markethink Hero"
              className="w-64 h-64 object-contain mx-auto drop-shadow-2xl rounded-3xl"
            />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              MarkeThink
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Plataforma de Automatización Agéntica de Marketing Digital
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex items-center justify-center gap-3 flex-wrap"
            >
              <Badge color="purple">Proyecto Integrado</Badge>
              <Badge color="blue">2º SMR</Badge>
              <Badge color="cyan">Yasir Soufi Hdidou</Badge>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-slate-600 mt-4"
          >
            Usa ← → o haz clic en las flechas para navegar
          </motion.p>
        </div>
      ),
    },

    /* 1 ─ ÍNDICE */
    {
      id: 'indice',
      title: 'Índice de la Presentación',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { n: '01', t: '¿Qué es MarkeThink?', icon: '💡' },
            { n: '02', t: 'Arquitectura Técnica', icon: '🏗️' },
            { n: '03', t: 'Stack Tecnológico', icon: '🛠️' },
            { n: '04', t: 'Servicios Instalados', icon: '🐳' },
            { n: '05', t: 'El Agente de IA (Claudio)', icon: '🤖' },
            { n: '06', t: 'Skills del Agente', icon: '⚡' },
            { n: '07', t: 'Dashboard (Agency OS)', icon: '📊' },
            { n: '08', t: 'Diario de a Bordo (I-III)', icon: '📓' },
            { n: '09', t: 'Flujo de Trabajo Completo', icon: '🔄' },
            { n: '10', t: 'Seguridad y Protección', icon: '🔒' },
            { n: '11', t: 'Copias de Seguridad', icon: '💾' },
            { n: '12', t: 'Pruebas y Verificación', icon: '✅' },
            { n: '13', t: 'Presupuesto Económico', icon: '💰' },
            { n: '14', t: 'Incidencias', icon: '🔧' },
            { n: '15', t: 'Conclusiones', icon: '🎯' },
          ].map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-purple-500/30 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-purple-400">{item.n}</span>
                <p className="text-sm font-medium text-white">{item.t}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },

    /* 2 ─ QUÉ ES MARKETHINK */
    {
      id: 'que-es',
      title: '¿Qué es MarkeThink?',
      subtitle: 'Definición del Problema y Solución',
      content: (
        <div className="space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6"
          >
            <h3 className="text-lg font-bold text-rose-300 flex items-center gap-2">🔴 El Problema</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              La creación, gestión y publicación de contenido de marketing supone un <strong className="text-white">gasto excesivo de tiempo y recursos</strong> para las PYMEs. 
              La dependencia de herramientas aisladas (editores, diseño, plataformas de despliegue) genera una <strong className="text-white">fragmentación del flujo de trabajo</strong>.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6"
          >
            <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">🟢 La Solución</h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              MarkeThink es un <strong className="text-white">sistema centralizado y automatizado</strong>, orquestado por un <strong className="text-white">Agente de Inteligencia Artificial</strong> que 
              controla el ciclo de vida completo del marketing: desde la <strong className="text-white">ideación hasta la publicación final</strong> en producción.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <StatCard value="5€" label="Coste mensual total" />
            <StatCard value="100%" label="Open Source" delay={0.1} />
            <StatCard value="24/7" label="Operación autónoma" delay={0.2} />
          </motion.div>
        </div>
      ),
    },

    /* 3 ─ ARQUITECTURA */
    {
      id: 'arquitectura',
      title: 'Arquitectura del Sistema',
      subtitle: 'Modelo de capas contenerizadas',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 overflow-hidden"
          >
            <img
              src="/presentacion/architecture.png"
              alt="Arquitectura del sistema MarkeThink"
              className="w-full h-auto max-h-[400px] object-contain bg-slate-900/50 p-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
              <p className="text-xs text-blue-400 font-semibold">INFRAESTRUCTURA</p>
              <p className="text-sm text-white mt-1">Proxmox → Ubuntu Server 24.04 LTS</p>
              <p className="text-xs text-slate-400 mt-1">2 CPUs · 4 GB RAM · IP estática</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
              <p className="text-xs text-purple-400 font-semibold">ORQUESTADOR</p>
              <p className="text-sm text-white mt-1">OpenClaw en Docker Container</p>
              <p className="text-xs text-slate-400 mt-1">Sandbox seguro con volumen persistente</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-xs text-cyan-400 font-semibold">CLOUD & DELIVERY</p>
              <p className="text-sm text-white mt-1">Vercel + Supabase + GCP</p>
              <p className="text-xs text-slate-400 mt-1">Edge CDN · Real-time · Vertex AI</p>
            </div>
          </motion.div>
        </div>
      ),
    },

    /* 4 ─ STACK TECNOLÓGICO */
    {
      id: 'stack',
      title: 'Stack Tecnológico',
      subtitle: 'Herramientas y tecnologías utilizadas',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <FeatureCard icon="⚛️" title="Next.js 15 + React" desc="SSR, App Router, Tailwind CSS v4, TypeScript. Dashboard con Framer Motion y @dnd-kit para Kanban interactivo." delay={0} />
          <FeatureCard icon="🗄️" title="Supabase (PostgreSQL)" desc="Base de datos relacional con Auth, RLS (Row Level Security), suscripción WebSocket en tiempo real." delay={0.1} />
          <FeatureCard icon="🤖" title="OpenClaw" desc="Framework agéntico open-source. Sandbox seguro con acceso a Bash/Node.js. Skills programables en JavaScript." delay={0.2} />
          <FeatureCard icon="☁️" title="Google Cloud Platform" desc="Vertex AI (Gemini 3.1 Flash-Image, Veo 3.1), Cloud TTS para clonación de voz. Autenticación ADC." delay={0.3} />
          <FeatureCard 
            icon="🐳" 
            title="Docker Engine 🔍" 
            desc="Contenerización del agente. docker-compose.yml con network_mode:host. (Clic para ver compose)" 
            delay={0.4} 
            onClick={onDockerClick}
          />
          <FeatureCard icon="🚀" title="Vercel + GitHub" desc="Despliegue GitOps automatizado. Cada commit en main dispara un deploy al Edge CDN. Latencia < 2s." delay={0.5} />
          <FeatureCard icon="📱" title="Telegram Bot API" desc="Canal de comunicación con el cliente. Webhook directo al agente OpenClaw para prompting natural." delay={0.6} />
          <FeatureCard icon="📂" title="Google Drive API" desc="Persistencia multimedia en la nube. Backup automático de imágenes y vídeos generados por la IA." delay={0.7} />
          <FeatureCard icon="🎬" title="FFMPEG" desc="Ensamblaje local de vídeo + audio. child_process asíncrono con Promises para evitar bloqueo del Event-Loop." delay={0.8} />
        </div>
      ),
    },

    /* 5 ─ SERVICIOS INSTALADOS */
    {
      id: 'servicios',
      title: 'Servicios Instalados',
      subtitle: 'Infraestructura del servidor (haz clic en Tailscale o Docker para ver configuración)',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left">
              <thead>
                <TableRow header cells={['Servicio', 'Versión / Detalle', 'Función']} />
              </thead>
              <tbody>
                <TableRow delay={0.1} cells={['🐧 Ubuntu Server', '24.04 LTS', 'Sistema operativo del host en Proxmox']} />
                <TableRow 
                  delay={0.15} 
                  cells={['🐳 Docker Engine 🔍', 'v26.1 (Clic para ver compose)', 'Contenerización del agente OpenClaw']} 
                  onClick={onDockerClick}
                />
                <TableRow delay={0.2} cells={['🤖 OpenClaw', '2026.5.27', 'Framework agéntico de IA con sandbox']} />
                <TableRow 
                  delay={0.25} 
                  cells={['🔗 Tailscale 🔍', 'VPN + SSH (Clic para ver panel)', 'Túnel privado (puerto 18789) para admin remota']} 
                  onClick={onTailscaleClick}
                />
                <TableRow delay={0.3} cells={['🎬 FFMPEG', 'Último estable', 'Renderizado multimedia local']} />
                <TableRow delay={0.35} cells={['🟢 Node.js', 'v20 LTS', 'Runtime para Skills del agente']} />
                <TableRow delay={0.4} cells={['📦 Git', 'Último', 'Control de versiones y GitOps pipeline']} />
                <TableRow delay={0.45} cells={['🌐 Vercel', 'Cloud hosting', 'Deploy automático + dominio gratuito .vercel.app']} />
                <TableRow delay={0.5} cells={['🗄️ Supabase', 'Cloud DB', 'PostgreSQL + Auth + Realtime WebSocket']} />
                <TableRow delay={0.55} cells={['☁️ GCP (Vertex AI)', 'APIs Cloud', 'Generación de imágenes, video y TTS']} />
              </tbody>
            </table>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Badge color="green" onClick={onTailscaleClick}>Tailscale — VPN SSH remoto 🔍</Badge>
            <Badge color="blue" onClick={onDockerClick}>Docker — Sandbox aislado 🔍</Badge>
            <Badge color="purple">OpenClaw — Orquestador IA</Badge>
            <Badge color="amber">Proxmox — Hipervisor</Badge>
          </motion.div>
        </div>
      ),
    },

    /* 6 ─ EL AGENTE "CLAUDIO" */
    {
      id: 'agente',
      title: 'El Agente de IA: Claudio',
      subtitle: 'Orquestador autónomo vía Telegram',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl">🤖</span>
              <div>
                <h3 className="text-xl font-bold text-white">¿Cómo funciona?</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  El cliente escribe en lenguaje natural en <strong className="text-blue-300">Telegram</strong>. 
                  Claudio, el agente OpenClaw, procesa la petición usando <strong className="text-purple-300">Zero-Shot Prompting</strong> y orquesta todas las herramientas 
                  necesarias para generar la campaña completa de marketing.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-w-lg mx-auto"
          >
            <img
              src="/presentacion/telegram_chat.png"
              alt="Conversación real con el Agente Claudio en Telegram"
              className="w-full h-auto max-h-[350px] object-contain bg-[#17212b]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Badge color="purple">IA Open Source (modelos chinos)</Badge>
            <Badge color="blue">Suscripción 5€/mes → 60$ créditos</Badge>
            <Badge color="cyan">OpenCode como proveedor</Badge>
          </motion.div>
        </div>
      ),
    },

    /* 7 ─ SKILLS DEL AGENTE */
    {
      id: 'skills',
      title: 'Skills del Agente',
      subtitle: 'Capacidades programadas en Node.js',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2"
          >
            <h3 className="font-bold text-amber-300 flex items-center gap-2">🎙️ Skill A: Copywriting + TTS</h3>
            <p className="text-xs text-slate-400">Gemini 3.1 Flash TTS via Vertex AI</p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Audio Tags: <code className="text-amber-300 text-xs">[excited]</code>, <code className="text-amber-300 text-xs">[serious]</code>, <code className="text-amber-300 text-xs">[whispers]</code></li>
              <li>Voces: Fenrir (energía), Sadachbia (corporativo)</li>
              <li>Clonación de voz con Cloud TTS</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-2"
          >
            <h3 className="font-bold text-blue-300 flex items-center gap-2">🖼️ Skill B: Generación Gráfica + B-Roll</h3>
            <p className="text-xs text-slate-400">Vertex AI (Gemini Flash-Image / Veo 3.1)</p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Imágenes en base64 → almacenadas como .png</li>
              <li>Vídeos B-Roll renderizados como .mp4</li>
              <li>Directorio persistente del contenedor Docker</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2"
          >
            <h3 className="font-bold text-rose-300 flex items-center gap-2">🎬 Skill C: Ensamblaje FFMPEG</h3>
            <p className="text-xs text-slate-400">child_process.exec asíncrono</p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Concatenación local audio (TTS) + vídeo (B-Roll)</li>
              <li>Sin Event-Loop Starvation (Promises)</li>
              <li>Renderizado en hardware del host</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 space-y-2"
          >
            <h3 className="font-bold text-green-300 flex items-center gap-2">🌐 Skill D: Landing Pages + GitOps</h3>
            <p className="text-xs text-slate-400">Google Stitch + Framework R.A.S.D. + Vercel</p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Genera index.html autónomo con Tailwind CSS</li>
              <li>git add → commit → push automático</li>
              <li>Deploy instantáneo en Vercel Edge CDN</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-2 md:col-span-2"
          >
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">☁️ Skill E: Persistencia Multimedia (Drive + Supabase)</h3>
            <p className="text-xs text-slate-400">googleapis + @supabase/supabase-js con Service Role Key</p>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Upload a Google Drive vía API (fs.createReadStream → POST multipart)</li>
              <li>Registro indexado en PostgreSQL (marketing_assets) con Service Role Key</li>
              <li>URLs públicas reflejadas en el dashboard en tiempo real</li>
            </ul>
          </motion.div>
        </div>
      ),
    },

    /* 8 ─ DASHBOARD */
    {
      id: 'dashboard',
      title: 'Dashboard: Agency OS',
      subtitle: 'Panel web de gestión con Kanban en tiempo real',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10"
          >
            <img
              src="/presentacion/kanban.png"
              alt="Panel Kanban de Agency OS — Tablero real con columnas Pendiente, Aprobado y Publicado"
              className="w-full h-auto max-h-[380px] object-contain bg-white"
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard icon="📋" title="Kanban Drag & Drop" desc="3 columnas: Pendiente, Aprobado, Publicado. Arrastrar tarjetas actualiza el status en Supabase en tiempo real." delay={0.2} />
            <FeatureCard icon="⚡" title="WebSocket Realtime" desc="Suscripción a INSERT/UPDATE/DELETE en campaigns y marketing_assets. Notificaciones Toast automáticas." delay={0.3} />
            <FeatureCard icon="✏️" title="Edición Inline" desc="Copies editables en caliente. Click → textarea → Guardar. UPDATE asíncrono inmediato a la base de datos." delay={0.4} />
            <FeatureCard icon="👁️" title="Preview Adaptativo" desc="Modal a pantalla completa: iframe para landings, img para banners, video HTML5 para reels y YouTube." delay={0.5} />
          </div>
        </div>
      ),
    },

    /* 9 ─ DIARIO DE A BORDO: INFRAESTRUCTURA */
    {
      id: 'diario-infra',
      title: 'Diario de a Bordo (I)',
      subtitle: 'Fase de Implementación — Infraestructura Base (haz clic en Docker para ver compose)',
      content: (
        <div className="space-y-5 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400 text-center italic"
          >
            Cronología real del proceso técnico seguido para la implantación completa de MarkeThink
          </motion.p>

          <div className="space-y-0">
            <TimelineStep
              step="1"
              title="Configuración de Red (Netplan)"
              desc="Primer paso tras instalar Ubuntu 24.04 LTS en Proxmox: IP estática 10.0.2.12/24, puerta de enlace 10.0.2.1. Fichero /etc/netplan/00-installer-config.yaml."
              delay={0}
            />
            <TimelineStep
              step="2"
              title="Instalación Global de OpenClaw"
              desc="Instalación del CLI del framework agéntico (v2026.5.27) a nivel global en el host: curl -fsSL https://openclaw.ai/install.sh | bash. Alias 'oclaw' configurado en ~/.bashrc."
              delay={0.15}
            />
            <TimelineStep
              step="3"
              title="Integración con Telegram"
              desc="Generación de un bot vía BotFather → token API. Configuración del webhook en OpenClaw para recibir y procesar mensajes (prompts) desde cualquier dispositivo."
              delay={0.3}
            />
            <TimelineStep
              step="4"
              title="Contenerización con Docker 🔍"
              desc="docker-compose.yml con network_mode:host y volumen persistente (~/.openclaw/workspace) para retención de datos. (Clic para ver archivo)"
              delay={0.45}
              onClick={onDockerClick}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <Badge color="green">Proxmox → Ubuntu 24.04 LTS</Badge>
            <Badge color="blue" onClick={onDockerClick}>Docker Engine v26.1 🔍</Badge>
            <Badge color="purple">OpenClaw 2026.5.27</Badge>
            <Badge color="cyan">Telegram Bot API</Badge>
          </motion.div>
        </div>
      ),
    },

    /* 10 ─ DIARIO DE A BORDO: CLOUD & SKILLS */
    {
      id: 'diario-cloud',
      title: 'Diario de a Bordo (II)',
      subtitle: 'Fase de Implementación — Cloud, Skills y Automatización',
      content: (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="space-y-0">
            <TimelineStep
              step="5"
              title="Credenciales GCP (Application Default Credentials)"
              desc="Cuenta de Servicio en IAM con roles Vertex AI User y Cloud TTS Admin. Clave RSA (gcp-credentials.json) montada como volumen :ro en Docker. Variable GOOGLE_APPLICATION_CREDENTIALS inyectada."
              delay={0}
            />
            <TimelineStep
              step="6"
              title="Desarrollo de Skills Nativas (Node.js)"
              desc="5 Skills programadas: A) Copywriting + TTS (Audio Tags, voces Fenrir/Sadachbia), B) Generación Gráfica + B-Roll (Vertex AI), C) Ensamblaje FFMPEG (child_process async), D) Landing Pages + GitOps (Google Stitch + R.A.S.D.), E) Persistencia (Drive + Supabase)."
              delay={0.2}
            />
            <TimelineStep
              step="7"
              title="Pipeline GitOps Automatizado"
              desc="Skill D ejecuta: git add index.html && git commit -m 'feat: auto-generation campaign ${id}' && git push origin main. Webhook de Vercel dispara deploy al Edge CDN en <2s."
              delay={0.4}
            />
            <TimelineStep
              step="8"
              title="Persistencia Multimedia (Drive + Supabase)"
              desc="Upload a Google Drive vía googleapis (fs.createReadStream → POST multipart). Inserción en tabla marketing_assets con Service Role Key (bypass RLS). WebSocket actualiza el dashboard en tiempo real."
              delay={0.6}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { icon: '🔑', label: 'ADC + Docker :ro' },
              { icon: '⚡', label: '5 Skills Node.js' },
              { icon: '🚀', label: 'GitOps Pipeline' },
              { icon: '☁️', label: 'Drive + Supabase' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-center rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-1 text-xs text-slate-400">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },

    /* 11 ─ DIARIO DE A BORDO: TAILSCALE + DASHBOARD */
    {
      id: 'diario-web',
      title: 'Diario de a Bordo (III)',
      subtitle: 'Fase de Implementación — Tailscale VPN y Dashboard Web',
      content: (
        <div className="space-y-5 max-w-4xl mx-auto">
          <div className="space-y-0">
            <TimelineStep
              step="9"
              title="Instalación de Tailscale (VPN SSH)"
              desc="Túnel VPN privado para administración remota 100% segura. SSH por puerto personalizado 18789. Sin exposición de puertos públicos. Elimina necesidad de presencia física en el CPD."
              delay={0}
            />
            <TimelineStep
              step="10"
              title="Desarrollo del Dashboard (Agency OS)"
              desc="Frontend con Next.js 15, TypeScript y Tailwind CSS v4. Tablero Kanban con @dnd-kit (Drag & Drop). Framer Motion para transiciones. Supabase Auth (Email/Password + JWT)."
              delay={0.2}
            />
            <TimelineStep
              step="11"
              title="Sistema de Tiempo Real (WebSocket)"
              desc="Suscripción a INSERT/UPDATE/DELETE en campaigns y marketing_assets via Supabase Realtime. Notificaciones Toast automáticas. Preview adaptativo: iframe, img, video HTML5."
              delay={0.4}
            />
            <TimelineStep
              step="12"
              title="Resolución de Incidencias Críticas"
              desc="Conflicto versiones OpenClaw (ingeniería inversa en openclaw.json), bloqueo RLS → Service Role Key, latencia 30s → <4s escalando VM a 2 CPUs + 4 GB RAM."
              delay={0.6}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"
          >
            <p className="text-sm text-emerald-300 font-semibold">
              🎯 Resultado: Sistema completo operativo — del prompt en Telegram a la producción en Vercel
            </p>
            <p className="text-xs text-slate-400 mt-1">
              12 pasos técnicos documentados · 5 Skills · 3 capas de seguridad · Deploy automático
            </p>
          </motion.div>
        </div>
      ),
    },

    /* 12 ─ FLUJO DE TRABAJO */
    {
      id: 'flujo',
      title: 'Flujo de Trabajo Completo',
      subtitle: 'Del prompt a la producción',
      content: (
        <div className="max-w-2xl mx-auto">
          <TimelineStep step="1" title="Cliente envía mensaje en Telegram" desc="Lenguaje natural: 'Quiero una campaña de relojes con landing page, vídeos e imágenes.'" delay={0} />
          <TimelineStep step="2" title="Claudio procesa con Zero-Shot Prompting" desc="Analiza la petición, identifica entregables y lanza las Skills necesarias en paralelo." delay={0.15} />
          <TimelineStep step="3" title="Generación de contenido multimedia" desc="Vertex AI genera imágenes/vídeos. Cloud TTS genera locución. FFMPEG ensambla todo localmente." delay={0.3} />
          <TimelineStep step="4" title="Landing Page con Google Stitch" desc="Framework R.A.S.D. genera un index.html con Tailwind CSS. Se escribe en el workspace local." delay={0.45} />
          <TimelineStep step="5" title="Pipeline GitOps automático" desc="git add → git commit → git push origin main. Vercel despliega en <2 segundos en Edge CDN." delay={0.6} />
          <TimelineStep step="6" title="Persistencia en la nube" desc="Archivos → Google Drive API. Metadatos → Supabase (marketing_assets). Dashboard actualizado en tiempo real." delay={0.75} />
          <TimelineStep step="7" title="Cliente revisa en Agency OS" desc="Tablero Kanban con Drag & Drop. Preview de todos los activos. Aprobación y publicación." delay={0.9} />
        </div>
      ),
    },

    /* 10 ─ SEGURIDAD */
    {
      id: 'seguridad',
      title: 'Seguridad y Protección de Datos',
      subtitle: 'Capas de seguridad implementadas (haz clic en Docker para ver compose)',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/10 overflow-hidden"
          >
            <img
              src="/presentacion/security.png"
              alt="Seguridad MarkeThink"
              className="w-full h-auto max-h-[250px] object-contain bg-slate-900/50 p-4"
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecurityItem icon="🔐" title="Row Level Security (RLS)" desc="Políticas en PostgreSQL: cada usuario solo accede a sus campañas autorizadas. auth.uid() = profile_id." delay={0.1} />
            <SecurityItem icon="🌐" title="HTTPS + Login cifrado" desc="Acceso seguro al dashboard mediante Supabase Auth (Email/Password) con tokens JWT cifrados." delay={0.2} />
            <SecurityItem icon="🔑" title="Service Role Key (bypass RLS)" desc="El agente IA usa la llave maestra para inserciones server-to-server, sin exponer credenciales en frontend." delay={0.3} />
            <SecurityItem icon="🛡️" title="Tailscale VPN (SSH privado)" desc="Administración 100% remota por túnel VPN privado. SSH por puerto 18789. Sin exposición pública." delay={0.4} />
            <SecurityItem 
              icon="🐳" 
              title="Docker Sandbox 🔍" 
              desc="Agente aislado en contenedor. (Clic para ver docker-compose.yml)" 
              delay={0.5} 
              onClick={onDockerClick}
            />
            <SecurityItem icon="🔒" title="ADC (Application Default Credentials)" desc="Claves RSA privadas para Vertex AI. Variable GOOGLE_APPLICATION_CREDENTIALS en .env aislado del host Docker." delay={0.6} />
          </div>
        </div>
      ),
    },

    /* 11 ─ COPIAS DE SEGURIDAD */
    {
      id: 'backups',
      title: 'Plan de Copias de Seguridad',
      subtitle: 'Estrategia multi-capa de backup',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-3"
            >
              <div className="text-4xl">💾</div>
              <h3 className="font-bold text-blue-300">Backup Local (Cron Job)</h3>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li>Cron job diario en Ubuntu Server</li>
                <li>Comprime <code className="text-blue-300 text-xs">/home/administrador/markethink</code></li>
                <li>Genera tarball con configuración, certificados, memoria del agente y scripts</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3"
            >
              <div className="text-4xl">🌐</div>
              <h3 className="font-bold text-amber-300">Backup en Red (NAS)</h3>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li>Sincronización vía <code className="text-amber-300 text-xs">rsync</code></li>
                <li>Tarball → almacenamiento de red (NAS) dedicado a backups</li>
                <li>Procedimiento automático y contenerizado</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3"
            >
              <div className="text-4xl">☁️</div>
              <h3 className="font-bold text-emerald-300">Backup en la Nube</h3>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li><strong>Google Drive</strong>: Creativos e imágenes/vídeos generados</li>
                <li><strong>Supabase</strong>: Base de datos PostgreSQL con replicación automática</li>
                <li><strong>GitHub</strong>: Código fuente versionado</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-300"
          >
            <span className="text-emerald-400 font-bold">3 capas de redundancia</span>: Local (tarball + cron) → Red (NAS + rsync) → Nube (Google Drive + Supabase + GitHub)
          </motion.div>
        </div>
      ),
    },

    /* 12 ─ PRUEBAS */
    {
      id: 'pruebas',
      title: 'Pruebas y Verificación',
      subtitle: 'Plan de pruebas funcionales',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left">
              <thead>
                <TableRow header cells={['Acción Realizada', 'Resultado Esperado', 'Estado']} />
              </thead>
              <tbody>
                <TableRow delay={0.1} cells={['Petición de saludo vía Bot Telegram', 'Confirmación webhook y respuesta', '✅ Éxito']} />
                <TableRow delay={0.15} cells={['Generación de imagen (Vertex AI)', 'Imagen B-Roll almacenada en workspace', '✅ Éxito']} />
                <TableRow delay={0.2} cells={['Generación de vídeo (Veo 3.1)', 'Clip .mp4 renderizado localmente', '✅ Éxito']} />
                <TableRow delay={0.25} cells={['Ensamblaje TTS + B-Roll (FFMPEG)', 'Video final con locución sincronizada', '✅ Éxito']} />
                <TableRow delay={0.3} cells={['Upload a Google Drive API', 'URL pública del archivo disponible', '✅ Éxito']} />
                <TableRow delay={0.35} cells={['Inserción en Supabase', 'Fila creada en marketing_assets', '✅ Éxito']} />
                <TableRow delay={0.4} cells={['GitOps y Vercel Deploy', 'Commit en main y landing publicada', '✅ Éxito']} />
                <TableRow delay={0.45} cells={['Dashboard reflejo en Tiempo Real', 'Cambios visibles sin recargar página', '✅ Éxito']} />
                <TableRow delay={0.5} cells={['Prueba de Estrés (FFMPEG)', 'Sin Event-Loop Starvation', '✅ Estable']} />
              </tbody>
            </table>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-emerald-400 font-semibold text-sm"
          >
            ✅ Todas las pruebas funcionales superadas con éxito
          </motion.div>
        </div>
      ),
    },

    /* 13 ─ PRESUPUESTO */
    {
      id: 'presupuesto',
      title: 'Presupuesto Económico',
      subtitle: 'Viabilidad con coste mínimo',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left">
              <thead>
                <TableRow header cells={['Concepto', 'Unidades', 'Coste', 'Total']} />
              </thead>
              <tbody>
                <TableRow delay={0.1} cells={['Servidor Físico (Proxmox)', '1 ud.', '0,00€ (Reaprovechado)', '0,00€']} />
                <TableRow delay={0.15} cells={['Licencias Software', 'Global', '0,00€ (Open Source)', '0,00€']} />
                <TableRow delay={0.2} cells={['APIs IA (Vertex AI, Cloud TTS)', 'Cuota mensual', 'Free Tier GCP (300$)', '0,00€']} />
                <TableRow delay={0.25} cells={['Suscripción OpenCode', '1', '5,00€/mes', '5,00€']} />
                <TableRow delay={0.3} cells={['Alojamiento y dominio (Vercel)', '1 ud.', 'Capa gratuita', '0,00€']} />
                <TableRow delay={0.35} cells={['Base de datos (Supabase)', '1 proyecto', 'Capa gratuita', '0,00€']} />
              </tbody>
            </table>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-center py-6"
          >
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              5,00€/mes
            </div>
            <p className="mt-2 text-slate-400">Coste total de operación mensual</p>
          </motion.div>
        </div>
      ),
    },

    /* 14 ─ INCIDENCIAS */
    {
      id: 'incidencias',
      title: 'Incidencias y Troubleshooting',
      subtitle: 'Problemas encontrados y soluciones aplicadas',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            {
              title: '1. Conflicto de Versiones OpenClaw',
              problem: 'Colisión entre versión del host (2026.5.27) y del contenedor (2026.5.20). Esquemas JSON de validación rígidos.',
              solution: 'Modificación estricta de openclaw.json para cumplir con el validador del framework.',
              color: 'amber',
            },
            {
              title: '2. Autenticación GCP (ADC)',
              problem: 'Imposibilidad de usar API Keys / Service Accounts en cuenta personal de GCP.',
              solution: 'Adoptado ADC con gcp-credentials.json como volumen de solo lectura (:ro) en Docker.',
              color: 'blue',
            },
            {
              title: '3. Bloqueo RLS en Supabase',
              problem: 'El agente no podía insertar en marketing_assets (violación de permisos RLS).',
              solution: 'Bypass legítimo con Service Role Key en las Skills de Node.js del agente.',
              color: 'rose',
            },
            {
              title: '4. Latencia Crítica del Agente',
              problem: 'Respuesta de 30s en Telegram. VM con solo 1 CPU y 2 GB RAM.',
              solution: 'Escalado en Proxmox a 2 CPUs + 4 GB RAM. Latencia restaurada a <4s.',
              color: 'green',
            },
          ].map((inc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <h4 className="font-bold text-white">{inc.title}</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="text-rose-300"><span className="font-semibold">Problema:</span> <span className="text-slate-400">{inc.problem}</span></div>
                <div className="text-emerald-300"><span className="font-semibold">Solución:</span> <span className="text-slate-400">{inc.solution}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },

    /* 15 ─ CONCLUSIONES */
    {
      id: 'conclusiones',
      title: 'Conclusiones',
      subtitle: 'Valoración personal y futuro',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6"
          >
            <p className="text-sm text-slate-300 leading-relaxed">
              MarkeThink ha demostrado la <strong className="text-white">viabilidad real</strong> de fusionar la administración de sistemas 
              tradicional (GNU/Linux, Bash, virtualización, microservicios) con las arquitecturas modernas de 
              <strong className="text-purple-300"> automatización asíncrona mediante Inteligencia Artificial</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6"
          >
            <h3 className="font-bold text-blue-300 mb-3">🎯 Aprendizajes clave</h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Ingeniería inversa sobre openclaw.json para configuración del framework</li>
              <li>Mitigación de bloqueos del Auth-Profile (Cooldown) de seguridad</li>
              <li>Estructuración del flujo asíncrono para manejar cuellos de botella del Event-Loop de Node.js</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6"
          >
            <h3 className="font-bold text-cyan-300 mb-3">🚀 Mejoras futuras</h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Especializar al agente en la creación de contenido de YouTube y canales completos</li>
              <li>Comunicación con el agente directamente desde la página web</li>
              <li>Mayor personalización del dashboard de MarkeThink</li>
            </ul>
          </motion.div>
        </div>
      ),
    },

    /* 16 ─ GRACIAS */
    {
      id: 'gracias',
      title: '',
      content: (
        <div className="flex flex-col items-center justify-center text-center gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-8xl"
          >
            🎯
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            ¡Gracias!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-slate-400 max-w-lg"
          >
            ¿Preguntas?
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <Badge color="purple">Yasir Soufi Hdidou</Badge>
            <Badge color="blue">2º SMR — Proyecto Integrado</Badge>
            <Badge color="cyan">MarkeThink — 2026</Badge>
          </motion.div>
        </div>
      ),
    },
  ]
}


/* ─────────── Main presentation component ─────────── */
export default function PresentacionPage() {
  const [tailscaleModalOpen, setTailscaleModalOpen] = useState(false)
  const [dockerModalOpen, setDockerModalOpen] = useState(false)

  const slides = useSlides({
    onTailscaleClick: () => setTailscaleModalOpen(true),
    onDockerClick: () => setDockerModalOpen(true)
  })
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current, slides.length],
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTailscaleModalOpen(false)
        setDockerModalOpen(false)
        return
      }
      if (tailscaleModalOpen || dockerModalOpen) return

      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft')                    { e.preventDefault(); prev() }
      if (e.key === 'Home')                         { e.preventDefault(); goTo(0) }
      if (e.key === 'End')                          { e.preventDefault(); goTo(slides.length - 1) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, goTo, slides.length, tailscaleModalOpen, dockerModalOpen])

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -600 : 600, opacity: 0 }),
  }

  const slide = slides[current]

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a0a1a] text-white overflow-hidden select-none">
      {/* ── Background effects ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px]" />
      </div>

      {/* ── Top bar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            MT
          </span>
          <span className="text-xs text-slate-500">MarkeThink — Presentación TFG</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            {current + 1} / {slides.length}
          </span>
          {/* Progress bar */}
          <div className="w-32 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* ── Slide content ── */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col px-8 py-6 overflow-y-auto"
          >
            {/* Slide title */}
            {slide.title && (
              <div className="mb-6 text-center shrink-0">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-black text-white"
                >
                  {slide.title}
                </motion.h2>
                {slide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-sm text-slate-400"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}
              </div>
            )}
            {/* Slide body */}
            <div className="flex-1 flex items-start justify-center">
              {slide.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Navigation controls ── */}
      <footer className="relative z-20 flex items-center justify-between px-6 py-3 border-t border-white/5">
        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft /> Anterior
        </button>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5 max-w-[60%] overflow-x-auto py-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-blue-500'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Siguiente <ChevronRight />
        </button>
      </footer>

      {/* ── Tailscale Modal ── */}
      <AnimatePresence>
        {tailscaleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTailscaleModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl border border-white/10 bg-[#0c0c22] p-6 shadow-2xl cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setTailscaleModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                aria-label="Cerrar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>🔗</span> Panel de Administración de Tailscale (Tailnet)
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Dispositivos autorizados en la VPN privada del proyecto. Se aprecia la máquina <code className="text-emerald-400 font-semibold">ubuntuserver</code> activa con la IP <code className="text-cyan-400 font-semibold">100.120.180.60</code>.
              </p>

              <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                <img
                  src="/presentacion/tailscale_panel.png"
                  alt="Panel de administración de Tailscale"
                  className="w-full h-auto max-h-[450px] object-contain mx-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Docker Compose Modal ── */}
      <AnimatePresence>
        {dockerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDockerModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-2xl border border-white/10 bg-[#0c0c22] p-6 shadow-2xl cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setDockerModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                aria-label="Cerrar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>🐳</span> Configuración de Docker Compose (docker-compose.yml)
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Configuración del contenedor del agente OpenClaw con acceso privilegiado y modo de red local del host.
              </p>

              <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950 p-4 font-mono text-[10px] md:text-xs text-slate-300 overflow-y-auto max-h-[380px] leading-relaxed select-text">
                <pre className="text-left whitespace-pre-wrap sm:whitespace-pre">
{`version: '3.8'

services:
  markethink-agent:
    image: ghcr.io/openclaw/openclaw:latest
    container_name: markethink-openclaw
    restart: unless-stopped

    # Control total del sistema
    privileged: true
    user: "root"

    # Red del host para escuchar en tus puertos actuales y usar Tailscale directamente
    network_mode: "host"
    pid: "host"

    volumes:
      # Mapeamos la carpeta actual directamente dentro del contenedor.
      # Docker usará la configuración actual sin tener que mover ningún archivo de sitio.
      - ~/.openclaw:/root/.openclaw

      # Mapeo del sistema de archivos de la VM y el socket de Docker
      - /:/host:rw
      - /var/run/docker.sock:/var/run/docker.sock

    # Idioma e historial de comandos
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/host/home/administrador/markethink/config/gcp-credentials.json
      - LANG=es_ES.UTF-8
      - TZ=Europe/Madrid`}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
