import { createClient, ErrorReply, RediSearchSchema, SchemaFieldTypes, SearchOptions } from 'redis'

/* Adjust these configuration options as you see fit. */
const REDIS_HOST = 'localhost'
const REDIS_PORT = 6379
const PREFIX = 'bigfoot'
const INDEX_NAME = `${PREFIX}:index`
const PAGE_SIZE = 10

/* Connect to Redis. Adjust the options to suit your needs. */
const redisOptions = {
  socket: { host: REDIS_HOST, port: REDIS_PORT }
}

const redis = await createClient(redisOptions)
  .on('error', err => console.log('Redis Client Error', err))
  .connect()

/*
  Drop the index if it's there and then recreate it. In a _real_ system, you'd
  want to do this only when the schema changed. For this example, that would be
  a distraction to the main point. So, we'll skip it.
*/
try {
  await redis.ft.dropIndex(INDEX_NAME)
} catch (error) {
  if (error instanceof ErrorReply && error.message !== 'Unknown Index name') throw error
}

const schema: RediSearchSchema = {
  '$.id': { type: SchemaFieldTypes.TAG, AS: 'id' },
  '$.title': { type: SchemaFieldTypes.TEXT, AS: 'title', WEIGHT: 2 },
  '$.account': { type: SchemaFieldTypes.TEXT, AS: 'notes', WEIGHT: 1 },
  '$.classification': { type: SchemaFieldTypes.TAG, AS: 'classification' },
  '$.location.county': { type: SchemaFieldTypes.TAG, AS: 'county' },
  '$.location.state': { type: SchemaFieldTypes.TAG, AS: 'state' },
  '$.location.lnglat': { type: SchemaFieldTypes.GEO, AS: 'lnglat' }
}

await redis.ft.create(INDEX_NAME, schema, {
  ON: 'JSON',
  PREFIX: `${PREFIX}:`
})

/* This is what a Bigfoot sighting is. */
export type BigfootSighting = {
  id: string
  title: string
  account: string
  classification: string
  location: {
    county: string
    state: string
    lnglat: string
  }
}

/* Calling it the BigfootSightingGenerator is just easier to read and type. */
export type BigfootSightingGenerator = AsyncGenerator<BigfootSighting, void, void>

/* This generator yields Bigfoot sightings from a Redis search query. */
export async function* fetchBigfootSightings(query: string): BigfootSightingGenerator {
  let offset = 0
  let hasMore = true

  while (hasMore) {
    /* Get a page of data. */
    const options: SearchOptions = {
      LIMIT: { from: offset, size: PAGE_SIZE },
      DIALECT: 4 // The latest dialect. Supports cool stuff like vector search.
    }

    const result = await redis.ft.search(INDEX_NAME, query, options)

    /* Loop over the resulting documents and yield them. */
    for (const document of result.documents) {
      /*
        There's only one value in the document and technically it's in a
        property named '0' but this looks better.
      */
      yield document.value[0] as BigfootSighting
    }

    /* Prepare for the next page. */
    hasMore = result.total >= offset
    offset += PAGE_SIZE
  }
}

/* Wrapping up some useful queries. */

export function fetchAll(): BigfootSightingGenerator {
  return fetchBigfootSightings('*')
}

export function fetchByKeywords(keywords: string): BigfootSightingGenerator {
  return fetchBigfootSightings(keywords)
}

export function fetchByClassification(classification: string): BigfootSightingGenerator {
  return fetchBigfootSightings(`@classification:{${classification}}`)
}

export function fetchByState(state: string): BigfootSightingGenerator {
  return fetchBigfootSightings(`@state:${state}`)
}

export function fetchByCountyAndState(county: string, state: string): BigfootSightingGenerator {
  return fetchBigfootSightings(`@county:${county} @state:${state}`)
}

export function fetchByLocation(longitude: number, latitude: number, radisInMiles: number): BigfootSightingGenerator {
  return fetchBigfootSightings(`@lnglat:[${longitude} ${latitude} ${radisInMiles} mi]`)
}
