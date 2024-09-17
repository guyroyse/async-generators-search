import { someNumbers, allNumbers, someAsyncNumbers, allAsyncNumbers } from '$lib/samples'

/*
  Note that I am fully aware that the following tests aren't actually
  asserting anything. I just needed an easy way to invoke the functions so
  that I would have some code for my video. And, I figured you might find
  them useful too.
*/

describe('#someNumbers', () => {
  test('that values can be accessed using .next()', () => {
    const generator = someNumbers()
    while (true) {
      const { value, done } = generator.next()
      if (done) break
      console.log(value)
    }
  })

  test('that values can be accessed using for-of loop', () => {
    for (const value of someNumbers()) {
      console.log(value)
    }
  })
})

describe('#allNumbers', () => {
  test('that values can be accessed using .next()', () => {
    const generator = allNumbers()
    console.log('1st', generator.next().value)
    console.log('2nd', generator.next().value)
    console.log('3rd', generator.next().value)
    console.log('4th', generator.next().value)
    console.log('5th', generator.next().value)
    console.log('Still not done', generator.next().done)
  })
})

describe('#someAsyncNumbers', () => {
  test('that values can be accessed using .next()', async () => {
    const generator = someAsyncNumbers()
    while (true) {
      const { value, done } = await generator.next()
      if (done) break
      console.log(value)
    }
  })

  test('that values can be accessed using for-await-of loop', async () => {
    for await (const value of someAsyncNumbers()) {
      console.log(value)
    }
  })
})

describe('#allAsyncNumbers', () => {
  test('that values can be accessed using .next()', async () => {
    const generator = allAsyncNumbers()
    console.log('1st', (await generator.next()).value)
    console.log('2nd', (await generator.next()).value)
    console.log('3rd', (await generator.next()).value)
    console.log('4th', (await generator.next()).value)
    console.log('5th', (await generator.next()).value)
    console.log('Still not done', (await generator.next()).done)
  })
})
