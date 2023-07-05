import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'Admin Dashboard',
   description: 'Admin Dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
      <ClerkProvider>
         <html lang="pt-BR">
            <body className={inter.className}>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
               >
                  <ToastProvider />
                  <ModalProvider />
                  {children}
               </ThemeProvider>
            </body>
         </html>
      </ClerkProvider>
   )
}
