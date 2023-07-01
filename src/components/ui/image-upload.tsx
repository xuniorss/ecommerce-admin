'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
   disabled?: boolean
   onChange: (value: string) => void
   onRemove: (value: string) => void
   value: Array<string>
}

const ImageUpload = ({
   disabled,
   onChange,
   onRemove,
   value,
}: ImageUploadProps) => {
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)
   }, [])

   const onUpload = useCallback(
      (result: any) => {
         onChange(result.info.secure_url)
      },
      [onChange]
   )

   if (!isMounted) return null

   return (
      <div>
         <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
               <div
                  key={url}
                  className="relative h-[12.5rem] w-[12.5rem] overflow-hidden rounded-md"
               >
                  <div className="absolute right-2 top-2 z-10">
                     <Button
                        type="button"
                        onClick={() => onRemove(url)}
                        variant="destructive"
                        size="sm"
                     >
                        <Trash className="h-4 w-4" />
                     </Button>
                  </div>
                  <Image fill className="object-cover" alt="Image" src={url} />
               </div>
            ))}
         </div>
         <CldUploadWidget onUpload={onUpload} uploadPreset="iu7e84dn">
            {({ open }) => {
               const onClick = () => open()

               return (
                  <Button
                     type="button"
                     disabled={disabled}
                     variant="secondary"
                     onClick={onClick}
                  >
                     <ImagePlus className="mr-2 h-4 w-4" />
                     Upload an Image
                  </Button>
               )
            }}
         </CldUploadWidget>
      </div>
   )
}

export default ImageUpload
