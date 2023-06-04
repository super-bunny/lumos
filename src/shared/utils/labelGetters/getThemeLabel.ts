import { Themes } from '../../../types/Settings'

export default function getThemeLabel(theme: Themes): string {
  switch (theme) {
    case Themes.MATERIAL_LIGHT:
      return 'Material Light'
    case Themes.MATERIAL_DARK:
      return 'Material Dark'
    case Themes.ORIGIN:
      return 'Origin'
    default:
      return theme
  }
}