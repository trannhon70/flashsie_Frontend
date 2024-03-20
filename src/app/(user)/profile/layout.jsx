import React from 'react'

export default function Layout({ children }) {
  return (
    <>
      <h1 className='mb-2 text-2xl font-semibold'>Profile</h1>
      {children}
    </>
  )
}
