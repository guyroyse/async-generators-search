import { BigfootSighting, BigfootSightingGenerator, fetchBigfootSightings } from '$lib/main'

describe('#fetchBigfootSightings', () => {
  let sightings: BigfootSightingGenerator

  /*
    Create some records in Redis to search.
    All locations were generated by GitHub Copilot to protect the innocent.
    The titles and accounts were written by the author.
  */
  beforeAll(async () => {
    await redis.json.set('bigfoot:42', '$', {
      id: '42',
      title: 'Bigfoot at the Walmart',
      account: 'I saw Bigfoot in Walmart buying flip flops. They looked to be a size 17.',
      classification: 'Class A',
      location: {
        county: 'Benton',
        state: 'WA',
        lnglat: '-119.1006,46.2396'
      }
    })

    await redis.json.set('bigfoot:23', '$', {
      id: '23',
      title: "Bigfoot's camera is full of blurry photos",
      account: "I found Bigfoot's camera out in the woods while camping. All the photos on it were blurry.",
      classification: 'Class B',
      location: {
        county: 'Skamania',
        state: 'WA',
        lnglat: '-122.1006,46.2396'
      }
    })

    await redis.json.set('bigfoot:13', '$', {
      id: '13',
      title: 'Bigfoot selling magazine subscriptions',
      account: 'Bigfoot came to my door selling magazine subscriptions. I bought them all!',
      classification: 'Class A',
      location: {
        county: 'Clackamas',
        state: 'OR',
        lnglat: '-122.1006,45.2396'
      }
    })
  })

  /* Clean up after the tests. */
  afterAll(async () => await redis.unlink(['bigfoot:42', 'bigfoot:23', 'bigfoot:13']))

  /* Fetch the sightings returning an async generator. */
  beforeEach(async () => (sightings = fetchBigfootSightings('*')))

  test('generator can be walked with `for await`', async () => {
    const sightingsArray: Array<BigfootSighting> = []

    for await (const sighting of sightings) {
      sightingsArray.push(sighting)
    }

    expect(sightingsArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '42',
          title: 'Bigfoot at the Walmart',
          classification: 'Class A'
        }),
        expect.objectContaining({
          id: '23',
          title: "Bigfoot's camera is full of blurry photos",
          classification: 'Class B'
        }),
        expect.objectContaining({
          id: '13',
          title: 'Bigfoot selling magazine subscriptions',
          classification: 'Class A'
        })
      ])
    )
  })

  test('generator can be walked with `next`', async () => {
    const sightingsArray: Array<BigfootSighting> = []

    let result = await sightings.next()

    while (!result.done) {
      sightingsArray.push(result.value)
      result = await sightings.next()
    }

    expect(sightingsArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '42',
          title: 'Bigfoot at the Walmart',
          classification: 'Class A'
        }),
        expect.objectContaining({
          id: '23',
          title: "Bigfoot's camera is full of blurry photos",
          classification: 'Class B'
        }),
        expect.objectContaining({
          id: '13',
          title: 'Bigfoot selling magazine subscriptions',
          classification: 'Class A'
        })
      ])
    )
  })
})
