import test from 'ava'
import { getInfo } from '../src/helpers'

test('getInfo should return detected wallet', async t => {
  const provider = {}
  const info = await getInfo(provider)
  t.is(info?.name, 'Detected Wallet')
})
