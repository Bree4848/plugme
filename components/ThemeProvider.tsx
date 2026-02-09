'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
// Removed the /dist/types import that was causing the error

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}