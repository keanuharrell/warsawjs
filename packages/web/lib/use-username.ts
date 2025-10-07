'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'warsawjs-username'

export function useUsername() {
  const [username, setUsername] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load username from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUsername(stored)
    }
    setIsLoading(false)
  }, [])

  const saveUsername = (name: string) => {
    const trimmed = name.trim()
    if (trimmed) {
      setUsername(trimmed)
      localStorage.setItem(STORAGE_KEY, trimmed)
    }
  }

  const clearUsername = () => {
    setUsername('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    username,
    isLoading,
    saveUsername,
    clearUsername,
    hasUsername: !!username,
  }
}
