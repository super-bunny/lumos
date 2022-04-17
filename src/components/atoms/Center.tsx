import React, { PropsWithChildren } from 'react'

export default function Center({ children }: PropsWithChildren<{}>) {
  return (
    <div
      style={ {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      } }
    >{ children }</div>
  )
}
