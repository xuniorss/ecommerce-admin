'use client'

import { AlertModal } from '@/components/modals/AlertModal'
import { ApiAlert } from '@/components/ui/api-alert'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useOrigin } from '@/hooks/useOrigin'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

interface SettingsProps {
   initialData: Store
}

const formSchema = z.object({
   name: z.string().min(1),
})

type FormProps = z.infer<typeof formSchema>

export const SettingsForm = ({ initialData }: SettingsProps) => {
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const params = useParams()
   const router = useRouter()

   const origin = useOrigin()

   const form = useForm<FormProps>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData,
   })

   const onSubmit: SubmitHandler<FormProps> = useCallback(
      async (data) => {
         try {
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success('Store updated.')
         } catch (error) {
            toast.error('Something went wrong.')
         }
      },
      [params.storeId, router]
   )

   const onDelete = useCallback(async () => {
      try {
         setLoading(true)

         await axios.delete(`/api/stores/${params.storeId}`)

         router.refresh()
         router.push('/')

         toast.success('Store deleted.')
      } catch (error) {
         toast.error('Make sure you removed all products and categories first.')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }, [params.storeId, router])

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title="Settings" description="Manage store preferences" />
            <Button
               disabled={form.formState.isSubmitting}
               variant="destructive"
               size="icon"
               onClick={() => setOpen(true)}
            >
               <Trash className="h-4 w-4" />
            </Button>
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8"
            >
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={form.formState.isSubmitting}
                                 placeholder="Store name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button
                  disabled={form.formState.isSubmitting}
                  className="ml-auto"
                  type="submit"
               >
                  Save changes
               </Button>
            </form>
         </Form>
         <Separator />
         <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${origin}/api/${params.storeId}`}
            variant="public"
         />
      </>
   )
}
