'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'auth_failed') {
      toast.error('La autenticación ha fallado. Inténtalo de nuevo.')
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      } else if (data.session) {
        toast.success('¡Registro exitoso! Iniciando sesión...')
        router.push('/dashboard')
      } else {
        toast.success('¡Registro casi completo! Revisa tu email para confirmar la cuenta.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : error.message)
      } else {
        toast.success('Sesión iniciada con éxito')
        router.push('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md p-8 m-4 bg-white/70 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl relative z-10"
    >
      {/* Branding header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30 text-white font-extrabold text-2xl tracking-wider mb-3"
        >
          MT
        </motion.div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Marke<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">think</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Automatización Agéntica de Marketing
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={isSignUp ? 'signup' : 'login'}
          initial={{ opacity: 0, x: isSignUp ? 15 : -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isSignUp ? -15 : 15 }}
          transition={{ duration: 0.25 }}
          onSubmit={handleAuth}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@agencia.com"
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none rounded-xl text-slate-800 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none rounded-xl text-slate-800 text-sm font-medium transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              'Crear Cuenta de Agencia'
            ) : (
              'Entrar al Dashboard'
            )}
          </button>
        </motion.form>
      </AnimatePresence>

      <div className="mt-6 text-center border-t border-slate-200/50 pt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-85 transition-opacity cursor-pointer"
        >
          {isSignUp
            ? '¿Ya tienes una cuenta? Iniciar Sesión'
            : '¿No tienes cuenta? Regístrate gratis'}
        </button>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-slate-50 via-slate-100 to-slate-200 overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-200/40 blur-3xl" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 m-4 bg-white/70 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl relative z-10 flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-500 mt-4">Iniciando Markethink...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
