import { createContext } from 'react'

export type UpdaterContextState = { updateAvailable: boolean }

const UpdaterContext = createContext<UpdaterContextState>({ updateAvailable: false })

export default UpdaterContext