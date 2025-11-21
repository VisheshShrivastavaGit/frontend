import React from 'react'

export default function MiddlePart({ children }) {
  return (
    <main className="flex-1 p-8 bg-white dark:bg-gray-900 min-h-[calc(100vh-56px)]">
      {children}
    </main>
  )
}
