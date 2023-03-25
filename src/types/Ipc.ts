export enum IpcEvents {
  GET_USER_DATA_PATH_SYNC = 'GET_USER_DATA_PATH_SYNC',
  PING = 'PING',
  LIST_DISPLAYS = 'LIST_DISPLAYS',
  SUPPORT_DDC = 'SUPPORT_DDC',
  GET_VCP_VALUE = 'GET_VCP_VALUE',
  SET_VCP_VALUE = 'SET_VCP_VALUE',
  // Store
  GET_SETTINGS = 'GET_SETTINGS',
  SET_SETTINGS = 'SET_SETTINGS',
  // Node
  GET_NODE_ENV = 'GET_NODE_ENV',
  // Backend
  GET_SESSION_JWT = 'GET_SESSION_JWT',
  GET_HTTP_API_CONFIG = 'GET_HTTP_API_CONFIG',
  // App
  RESTART_APP = 'RESTART_APP',
  REGISTER_ALL_SHORTCUTS = 'REGISTER_ALL_SHORTCUTS',
  UNREGISTER_ALL_SHORTCUTS = 'UNREGISTER_ALL_SHORTCUTS',
  DISPLAY_UPDATE = 'DISPLAY_UPDATE',
  FORCE_TRIGGER_AUTO_MONITORS_POWER_OFF = 'FORCE_TRIGGER_AUTO_MONITORS_POWER_OFF',
  OPEN_DEV_TOOLS = 'OPEN_DEV_TOOLS',
}

export interface IpcMessage<T = any> {
  event: IpcEvents
  payload?: T
}