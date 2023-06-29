import { ModalProvider } from '@/providers/modal-provider'
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
               <ModalProvider />
               {children}
            </body>
         </html>
      </ClerkProvider>
   )
}
