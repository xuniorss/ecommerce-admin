import prismadb from '@/lib/prismadb'

interface DashPageProps {
   params: { storeId: string }
}

export default async function DashboardPage({ params }: DashPageProps) {
   const store = await prismadb.store.findFirst({
      where: { id: params.storeId },
   })

   return <div>Active store: {store?.name}</div>
}
