'use client'

import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/useStoreModal'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({
   name: z.string().min(1),
})

type FormProps = z.infer<typeof formSchema>

export const StoreModal = () => {
   const storeModal = useStoreModal()

   const form = useForm<FormProps>({
      resolver: zodResolver(formSchema),
      defaultValues: { name: '' },
      reValidateMode: 'onChange',
   })

   const onSubmit: SubmitHandler<FormProps> = useCallback(async (values) => {
      try {
         const { data } = await axios.post('/api/stores', values)
         toast.success('Store created.')
      } catch (error) {
         toast.error('Something went wrong.')
      }
   }, [])

   return (
      <Modal
         title="Create store"
         description="Add a new store to manage products and categories"
         isOpen={storeModal.isOpen}
         onClose={storeModal.onClose}
      >
         <div>
            <div className="space-y-4 py-2 pb-4">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input
                                    disabled={form.formState.isSubmitting}
                                    placeholder="E-Commerce"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex w-full items-center justify-end space-x-2 pt-6">
                        <Button
                           disabled={form.formState.isSubmitting}
                           variant="outline"
                           onClick={storeModal.onClose}
                        >
                           Cancel
                        </Button>
                        <Button
                           disabled={form.formState.isSubmitting}
                           type="submit"
                        >
                           Continue
                        </Button>
                     </div>
                  </form>
               </Form>
            </div>
         </div>
      </Modal>
   )
}
