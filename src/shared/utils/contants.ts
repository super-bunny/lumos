import { Themes } from '../../types/Settings'

export interface Constants {
  defaultTheme: Themes
}

const constants: Constants = {
  defaultTheme: Themes.MATERIAL_LIGHT,
}

export default constants