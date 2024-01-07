import {FC, ReactNode} from 'react'

interface LayoutProps {
  children: ReactNode
}

const layout: FC<LayoutProps> = ({children}) => {
  return <div>{children}</div>
}

export default Layout
