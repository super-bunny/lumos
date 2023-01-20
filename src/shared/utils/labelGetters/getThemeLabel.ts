import { Themes } from '../../../types/Settings'

export default function getThemeLabel(theme: Themes): string {
  switch (theme) {
    case Themes.DEFAULT:
      return 'Default'
    case Themes.MATERIAL_LIGHT:
      console.log('OK')
      return 'Material Light'
    default:
      return theme
  }
}