export enum IpcEvents {
  LIST_DISPLAYS = 'LIST_DISPLAYS',
  SUPPORT_DDC = 'SUPPORT_DDC',
  GET_VCP_VALUE = 'GET_VCP_VALUE',
  SET_VCP_VALUE = 'SET_VCP_VALUE',
  // Store
  GET_STORE = 'GET_STORE',
  SET_STORE_DATA = 'SET_STORE_DATA',
  // Node
  GET_NODE_ENV = 'GET_NODE_ENV',
  // Backend
  GET_SESSION_JWT = 'GET_SESSION_JWT',
  GET_HTTP_API_CONFIG = 'GET_HTTP_API_CONFIG',
}

export interface IpcMessage<T = any> {
  event: IpcEvents
  payload?: T
}