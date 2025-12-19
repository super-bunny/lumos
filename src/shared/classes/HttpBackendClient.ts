import axios, { AxiosInstance } from 'axios'
import BackendClient from './BackendClient'
import { DisplayInfo, VCPValue } from '../../types/EnhancedDDCDisplay'

export interface Options {
  host?: string
  port?: number
}

export default class HttpBackendClient extends BackendClient {
  readonly axios: AxiosInstance

  constructor(public jwt: string, public readonly options?: Options) {
    super()
    this.axios = axios.create({
      baseURL: `http://${ options?.host ?? 'localhost' }:${ options?.port ?? 8787 }/displays`,
      headers: {
        'Authorization': `Bearer ${ jwt }`,
      },
    })
  }

  clone(): HttpBackendClient {
    return new HttpBackendClient(this.jwt, this.options)
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