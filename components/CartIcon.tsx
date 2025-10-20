import React from 'react'

interface CartIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export default function CartIcon({ className = "w-6 h-6", ...props }: CartIconProps) {
  return (
    <svg 
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Main basket shape */}
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      {/* Handle */}
      <path d="M16 10a4 4 0 0 1-8 0"></path>
      {/* Wheels */}
      <circle cx="8" cy="20" r="1"></circle>
      <circle cx="16" cy="20" r="1"></circle>
    </svg>
  )
}
