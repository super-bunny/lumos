import React, { HTMLAttributes, ReactNode } from 'react'

interface TabPanelProps {
  index: number
  value: number
  DivProps?: HTMLAttributes<HTMLDivElement>
  children?: ReactNode
}

function TabPanel({ value, index, DivProps, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      { ...DivProps }
    >
      { value === index && children }
    </div>
  )
}