import React, { useEffect, useMemo, useRef, useState } from 'react'
import './ScreenSelector.css'
import useSwr from 'swr'
import Loader from '../atoms/Loader'

export interface Props {
  selectedScreenId?: Electron.Display['id']
  onScreenSelect?: (screen: Electron.Display) => void
}

const SCREEN_MARGIN: number = 6

export default function ScreenSelector({ selectedScreenId, onScreenSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerBounds, setContainerBounds] = useState<DOMRect>()

  const {
    data: displays,
    isLoading,
  } = useSwr('window.lumos.getElectronDisplays', () => window.lumos.getElectronDisplays())

  const info = useMemo(() => {
    if (!displays || !containerBounds) return null

    const minX = displays.reduce((acc, display) => acc < display.bounds.x ? acc : display.bounds.x, 0)
    const minY = displays.reduce((acc, display) => acc < display.bounds.y ? acc : display.bounds.y, 0)
    const maxX = displays.reduce((
      acc,
      display,
    ) => acc > display.bounds.x + display.bounds.width ? acc : display.bounds.x + display.bounds.width, 0)
    const maxY = displays.reduce((
      acc,
      display,
    ) => acc > display.bounds.y + display.bounds.height ? acc : display.bounds.y + display.bounds.height, 0)
    const totalWidth = maxX - minX
    const totalHeight = maxY - minY
    const xOffset = Math.abs(minX)
    const yOffset = Math.abs(minY)

    const { width: elementWidth, height: elementHeight } = containerBounds

    return { minX, minY, maxX, maxY, totalWidth, totalHeight, xOffset, yOffset, elementWidth, elementHeight }
  }, [displays, containerBounds])

  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      setContainerBounds(containerRef.current?.getBoundingClientRect())
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [containerRef])

  return (
    <div>
      { isLoading && <Loader/> }

      <div ref={ containerRef } style={ { height: 300, width: '100%', position: 'relative' } }>
        { displays && info && displays.map((display, index) => (
          <div
            onClick={ () => onScreenSelect?.(display) }
            className={ ['screen', display.id === selectedScreenId ? 'selected' : ''].join(' ') }
            style={ {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: (display.bounds.x + info.xOffset) * info.elementWidth / info.totalWidth + SCREEN_MARGIN / 2,
              top: (display.bounds.y + info.yOffset) * info.elementHeight / info.totalHeight + SCREEN_MARGIN / 2,
              width: display.bounds.width * info.elementWidth / info.totalWidth - SCREEN_MARGIN,
              height: display.bounds.height * info.elementHeight / info.totalHeight - SCREEN_MARGIN,
              backgroundColor: 'whitesmoke',
              borderRadius: 8,
            } }
            key={ display.id }
          >
            <div style={ { color: 'rgba(0, 0, 0, 0.87)' } }>{ display.label }</div>
          </div>
        )) }
      </div>
    </div>
  )
}