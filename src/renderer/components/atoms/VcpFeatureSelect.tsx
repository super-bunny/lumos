import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import {
  Audio,
  DigitalPacketVideoLink,
  DisplayControl,
  Geometry,
  ImageAdjustment,
  Miscellaneous,
  PresetOperation,
} from '../../../types/VCPFeatures'

export interface Props {
  vcpFeature: number | null
  onChange?: (vcpFeature: number | null) => void
}

function pascalToTitleCase(str: string) {
  const result = str.replace(/([A-Z])/g, ' $1').trim()
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function vcpEnumToOptions(obj: object, group: string) {
  return Object.entries(obj)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      key: pascalToTitleCase(key), value, group,
    }))
}

const OPTIONS: Array<{ key: string, value: number, group: string }> = [
  ...vcpEnumToOptions(PresetOperation, 'Preset Operation'),
  ...vcpEnumToOptions(ImageAdjustment, 'Image Adjustment'),
  ...vcpEnumToOptions(DisplayControl, 'Display Control'),
  ...vcpEnumToOptions(Geometry, 'Geometry'),
  ...vcpEnumToOptions(Miscellaneous, 'Miscellaneous'),
  ...vcpEnumToOptions(Audio, 'Audio'),
  ...vcpEnumToOptions(DigitalPacketVideoLink, 'Digital Packet Video Link'),
]

export default function VcpFeatureSelect({ vcpFeature, onChange }: Props) {
  const [inputValue, setInputValue] = useState<string>('')

  const selectedVcpFeature = OPTIONS.find(feature => feature.value === vcpFeature)

  return (
    <Autocomplete
      disablePortal
      value={ selectedVcpFeature ?? null }
      onChange={ (event, option) => {
        if (option === null) {
          onChange?.(null)
          return
        }
        if (typeof option === 'object') {
          onChange?.(option?.value ?? null)
          return
        }

        const numberValue = parseInt(option, 16)

        onChange?.(isNaN(numberValue) ? null : numberValue)
        setInputValue(isNaN(numberValue) ? '' : numberValue.toString(16).toUpperCase())
      } }
      inputValue={ inputValue }
      onInputChange={ (event, value) => setInputValue(value) }
      onBlur={ () => {
        if (inputValue === '') onChange?.(null)
      } }
      options={ OPTIONS }
      groupBy={ option => option.group }
      getOptionLabel={ option => typeof option === 'object' ? `${ option.value.toString(16).toUpperCase() } - ${ option.key }` : option }
      renderInput={ (params) =>
        <TextField
          { ...params }
          label="VCP Feature"
          inputProps={ { ...params.inputProps, style: { paddingLeft: 0 } } }
          InputProps={ { ...params.InputProps, startAdornment: '0x' } }
        />
      }
      freeSolo
      fullWidth
      size={ 'small' }
    />
  )
}