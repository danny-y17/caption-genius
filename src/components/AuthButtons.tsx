// src/components/AuthButtons.tsx

'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthButtons() {
  const { data: session } = useSession()

  return session ? (
    <div className="space-x-2">
      <span>Signed in as {session.user?.email}</span>
      <button onClick={() => signOut()} className="underline">Sign Out</button>
    </div>
  ) : (
    <button onClick={() => signIn('github')} className="underline">Sign In</button>
  )
}
