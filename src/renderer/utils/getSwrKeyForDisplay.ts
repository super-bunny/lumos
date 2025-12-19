import GenericDisplay from '../../shared/classes/GenericDisplay'

export default function getSwrKeyForDisplay(displayId: string, method: keyof GenericDisplay): string {
  return `${ displayId }-${ method }`
}