import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Возвращает экземпляр Payload CMS.
 * Используется в серверных компонентах и API-маршрутах.
 */
export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}
