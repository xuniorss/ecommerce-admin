'use client'

import { useStoreModal } from '@/hooks/useStoreModal'
import { cn } from '@/lib/utils'
import { Store } from '@prisma/client'
import {
   Check,
   ChevronsUpDown,
   PlusCircle,
   Store as StoreIcon,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { ComponentPropsWithoutRef, useCallback, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type PoppoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PoppoverTriggerProps {
   items: Array<Store>
}

export const StoreSwitcher = ({
   className,
   items = [],
}: StoreSwitcherProps) => {
   const [open, setOpen] = useState(false)

   const storeModal = useStoreModal()
   const params = useParams()
   const router = useRouter()

   const formattedItems = useMemo(
      () => items.map((item) => ({ label: item.name, value: item.id })),
      [items]
   )

   const currentStore = useMemo(
      () => formattedItems.find((item) => item.value === params.storeId),
      [formattedItems, params.storeId]
   )

   const onStoreSelect = useCallback(
      (store: { value: string; label: string }) => {
         setOpen(false)
         router.push(`/${store.value}`)
      },
      [router]
   )

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               size="sm"
               role="combobox"
               aria-expanded={open}
               aria-label="Select a store"
               className={cn('w-[12.5rem] justify-between', className)}
            >
               <StoreIcon className="mr-2 h-4 w-4" />
               {currentStore?.label}
               <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[12.5rem] p-0">
            <Command>
               <CommandList>
                  <CommandInput placeholder="Search store..." />
                  <CommandEmpty>No store found.</CommandEmpty>
                  <CommandGroup heading="Stores">
                     {formattedItems.map((store) => (
                        <CommandItem
                           key={store.value}
                           onSelect={() => onStoreSelect(store)}
                           className="text-sm"
                        >
                           <StoreIcon className="mr-2 h-4 w-4" />
                           {store.label}
                           <Check
                              className={cn(
                                 'ml-auto h-4 w-4',
                                 currentStore?.value === store.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                              )}
                           />
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
               <CommandSeparator />
               <CommandList>
                  <CommandGroup>
                     <CommandItem
                        onSelect={() => {
                           setOpen(false)
                           storeModal.onOpen()
                        }}
                     >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Store
                     </CommandItem>
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}
