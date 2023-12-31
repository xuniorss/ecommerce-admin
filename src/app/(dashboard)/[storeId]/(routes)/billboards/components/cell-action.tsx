'use client'

import { AlertModal } from '@/components/modals/AlertModal'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { BillboardColumn } from './columns'

interface CellActProps {
   data: BillboardColumn
}

export const CellAction = ({ data }: CellActProps) => {
   const [loading, setLoading] = useState(false)
   const [open, setOpen] = useState(false)

   const router = useRouter()
   const params = useParams()

   const onCopy = useCallback((id: string) => {
      navigator.clipboard.writeText(id)
      toast.success('Billboard Id copied to the clipboard.')
   }, [])

   const onDelete = useCallback(async () => {
      try {
         setLoading(true)
         await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
         router.refresh()
         toast.success('Billboard deleted.')
      } catch (error: any) {
         toast.error(
            'Make sure you removed all categories using this billboard first.'
         )
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }, [data.id, params.storeId, router])

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem onClick={() => onCopy(data.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Id
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() =>
                     router.push(`/${params.storeId}/billboards/${data.id}`)
                  }
               >
                  <Edit className="mr-2 h-4 w-4" />
                  Update
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   )
}
