'use client'

import { FC } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps{}

const Providers: FC<ProvidersProps> = ({}) => {
  return <>
  <Toaster position='top-center' reverseOrder={false} />
  Providers
  </>
}

export default Providers
