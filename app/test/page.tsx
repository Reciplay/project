"use client"

import { useAuthStore } from "@/stores/authStore"

export default function TestPage() {
  const token = useAuthStore((state) => state.accessToken)
  const isLoggedIn =useAuthStore((state) => state.isLoggedIn)
  console.log(token)
  return (
    <div>
      <p>accessToken : {token}</p>
      <p>isLoggedIn : {isLoggedIn ? 'true' : 'false'}</p>
    </div>
  )
}
