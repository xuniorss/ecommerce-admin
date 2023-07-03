'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard, Category } from '@prisma/client'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

import { AlertModal } from '@/components/modals/AlertModal'
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
   name: z.string().min(1),
   billboardId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
   initialData: Category | null
   billboards: Array<Billboard>
}

export const CategoryForm = ({
   initialData,
   billboards,
}: CategoryFormProps) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = useMemo(
      () => (initialData ? 'Edit category' : 'Create category'),
      [initialData]
   )

   const description = useMemo(
      () => (initialData ? 'Edit a category.' : 'Add a new category'),
      [initialData]
   )

   const toastMessage = useMemo(
      () => (initialData ? 'Category updated.' : 'Category created.'),
      [initialData]
   )
   const action = useMemo(
      () => (initialData ? 'Save changes' : 'Create'),
      [initialData]
   )

   const form = useForm<CategoryFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || { name: '', billboardId: '' },
   })

   const onSubmit: SubmitHandler<CategoryFormValues> = useCallback(
      async (data) => {
         try {
            setLoading(true)
            if (initialData) {
               await axios.patch(
                  `/api/${params.storeId}/categories/${params.categoryId}`,
                  data
               )
            } else {
               await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
         } catch (error: any) {
            toast.error('Something went wrong.')
         } finally {
            setLoading(false)
         }
      },
      [initialData, params.categoryId, params.storeId, router, toastMessage]
   )

   const onDelete = useCallback(async () => {
      try {
         setLoading(true)
         await axios.delete(
            `/api/${params.storeId}/categories/${params.categoryId}`
         )
         router.refresh()
         router.push(`/${params.storeId}/categories`)
         toast.success('Category deleted.')
      } catch (error: any) {
         toast.error(
            'Make sure you removed all products using this category first.'
         )
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }, [params.categoryId, params.storeId, router])

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="h-4 w-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8"
            >
               <div className="gap-8 md:grid md:grid-cols-3">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Category name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="billboardId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Billboard</FormLabel>
                           <Select
                              disabled={loading}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue
                                       defaultValue={field.value}
                                       placeholder="Select a billboard"
                                    />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {billboards.map((billboard) => (
                                    <SelectItem
                                       key={billboard.id}
                                       value={billboard.id}
                                    >
                                       {billboard.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
