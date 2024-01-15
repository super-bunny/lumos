import { UpdateChannels } from './UpdateChannels'

export default interface ChangelogManifest {
  v1: Record<UpdateChannels, string>
}