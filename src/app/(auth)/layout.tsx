import React, { FC } from 'react'

type AuthLayoutProps = {
  children : React.ReactNode
}

const AuthLayout : FC<AuthLayoutProps> = ({children}) => {
  return (
    <section className='authLayout flex items-center justify-center w-full h-full'>
      {children}
    </section>
  )
}

export default AuthLayout