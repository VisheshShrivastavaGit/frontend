import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SidebarNew } from './SidebarNew'

export default function MobileSideBar() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <button onClick={toggle} className="md:hidden p-2 bg-black dark:bg-white dark:text-black text-white rounded">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      <div className={`fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-900 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link to="/" className="font-semibold">Track Your Attendance</Link>
          <button onClick={toggle} className="p-2">Close</button>
        </div>
        <div className="p-4">
          <SidebarNew />
        </div>
      </div>
    </>
  )
}
