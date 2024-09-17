function* someNumbers(): Generator<number> {
  yield 1
  yield 2
  yield 3
}

function* allNumbers(): Generator<number> {
  let i = 0
  while (true) yield i++
}

async function* someAsyncNumbers(): AsyncGenerator<number> {
  yield Promise.resolve(1)
  yield Promise.resolve(2)
  yield Promise.resolve(3)
}

async function* allAsyncNumbers(): AsyncGenerator<number> {
  let i = 0
  while (true) yield Promise.resolve(i++)
}

export { someNumbers, allNumbers, someAsyncNumbers, allAsyncNumbers }
