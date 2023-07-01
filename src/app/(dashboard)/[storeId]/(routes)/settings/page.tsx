import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { SettingsForm } from './components/SettingsForm'

interface SettingsProps {
   params: { storeId: string }
}

export default async function Settings({ params }: SettingsProps) {
   const { userId } = auth()

   if (!userId) redirect('/sign-in')

   const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
   })

   if (!store) redirect('/')

   return (
      <div className="flex flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={store} />
         </div>
      </div>
   )
}
