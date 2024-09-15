import 'vitest'

import { createClient } from 'redis'

export type RedisConnection = ReturnType<typeof createClient>

export {}

declare global {
  function when(description: string, fn: (this: any) => void): void
  function and(description: string, fn: (this: any) => void): void
  let redis: RedisConnection
}
