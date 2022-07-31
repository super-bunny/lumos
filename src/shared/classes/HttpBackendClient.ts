import { DisplayInfo, VCPValue } from '../../main/classes/AbstractDisplay'
import axios, { AxiosInstance } from 'axios'
import BackendClient from './BackendClient'

export interface Options {
  port?: number
}

export default class HttpBackendClient implements BackendClient {
  readonly axios: AxiosInstance

  constructor(public jwt: string, options?: Options) {
    this.axios = axios.create({
      baseURL: `http://localhost:${ options?.port ?? 8787 }/displays`,
      headers: {
        'Authorization': `Bearer ${ jwt }`,
      },
    })
  }

  async supportDDC(id: string): Promise<boolean> {
    return this.axios.post('support-ddc', {
      id,
    })
      .then(res => res.data.supportDDC)
  }

  async getVcpValue(id: string, featureCode: number): Promise<VCPValue> {
    return this.axios.post('get-vcp-feature', {
      id,
      featureCode,
    })
      .then(res => res.data.vpcValue)
  }

  async setVcpValue(id: string, featureCode: number, value: number): Promise<void> {
    return this.axios.post('set-vcp-feature', {
      id,
      featureCode,
      value,
    })
  }

  async list(): Promise<Array<DisplayInfo>> {
    return this.axios.get('/')
      .then(res => res.data.displays)
  }
}