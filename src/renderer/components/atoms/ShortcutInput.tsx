import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, ClickAwayListener, TextField } from '@mui/material'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import ShortcutAccelerator from './ShortcutAccelerator'

export interface Props {
  value?: string
  onChange?: (accelerator: string) => void
  disabled?: boolean
}

const getAcceleratorFromKeyboardEvent = (event: React.KeyboardEvent): string => {
  const keys: Array<string> = []
  if (event.ctrlKey) keys.push('Ctrl')
  if (event.shiftKey) keys.push('Shift')
  if (event.altKey) keys.push('Alt')
  if (event.metaKey) keys.push('Meta')
  if (event.keyCode === 32) keys.push('Space')
  else if (event.key.match(/Arrow(Up|Down|Left|Right)/)) keys.push(event.key.replace('Arrow', ''))
  else if (event.key === '+') keys.push('Plus')
  else if (event.key && !['Control', 'Shift', 'Alt'].includes(event.key)) keys.push(event.key)

  return keys.join('+')
}

export default function ShortcutInput({ value: propValue, onChange, disabled }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [capture, setCapture] = useState(false)
  const [accelerator, setAccelerator] = useState<string | undefined>(propValue)
  const [keyDownCount, setKeyDownCount] = useState<number>(0)

  const value = capture ? accelerator : propValue ?? accelerator

  const startCapture = useCallback(() => {
    if (capture) return
    setKeyDownCount(0)
    setCapture(true)
    ref.current?.focus()
  }, [capture])
  const stopCapture = useCallback(() => {
    if (!capture) return
    setCapture(false)
    ref.current?.blur()
    if (accelerator && accelerator !== propValue) onChange?.(accelerator)
    setKeyDownCount(0)
  }, [accelerator, capture, onChange, propValue])

  useEffect(() => {
    if (!capture && propValue && propValue !== accelerator) setAccelerator(propValue)
  }, [accelerator, capture, propValue])

  return (
    <ClickAwayListener onClickAway={ stopCapture }>
      <TextField
        inputRef={ ref }
        value={ '' }
        disabled={ disabled }
        focused={ capture }
        onKeyDown={ event => {
          event.preventDefault()
          if (!capture || event.repeat) return
          setKeyDownCount(keyDownCount => keyDownCount + 1)
          setAccelerator(getAcceleratorFromKeyboardEvent(event))
        } }
        onKeyUp={ event => {
          event.preventDefault()
          if (!capture || event.repeat) return
          if (keyDownCount - 1 >= 0) stopCapture()
          setKeyDownCount(keyDownCount => keyDownCount - 1)
        } }
        onClick={ () => {
          if (disabled) return
          startCapture()
        } }
        label="Shortcut"
        variant="outlined"
        color={ capture ? 'warning' : undefined }
        InputProps={ {
          startAdornment: value ?
            <ShortcutAccelerator
              accelerator={ value }
              sx={ { cursor: disabled ? undefined : 'pointer' } }
            /> : undefined,
          endAdornment: <Button
            disabled={ disabled }
            onClick={ event => {
              event.stopPropagation()
              capture ? stopCapture() : startCapture()
            } }
            color={ capture ? 'error' : undefined }
            variant={ capture ? 'contained' : 'text' }
            startIcon={ <KeyboardIcon/> }
          >{ capture ? 'Stop recording' : 'Edit' }</Button>,
          style: { cursor: disabled ? undefined : 'pointer' },
        } }
        inputProps={ {
          tabIndex: -1,
          style: { width: value?.length ? 10 : 80, cursor: disabled ? undefined : 'pointer' },
        } }
        style={ { caretColor: 'transparent' } }
      />
    </ClickAwayListener>
  )
}