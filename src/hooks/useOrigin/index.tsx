import { useEffect, useMemo, useState } from 'react'

export const useOrigin = () => {
   const [mounted, setMounted] = useState(false)

   const origin = useMemo(
      () =>
         typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '',
      []
   )

   useEffect(() => {
      setMounted(true)
   }, [])

   if (!mounted) return ''

   return origin
}
