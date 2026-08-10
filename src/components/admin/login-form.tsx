'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined)

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <Card className="w-full max-w-sm border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <CardTitle>Fama Ranch — Admin</CardTitle>
          <CardDescription className="text-neutral-400">
            Inicia sesión para gestionar pedidos y menú.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
