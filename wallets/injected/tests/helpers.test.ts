import test from 'ava'
import { getInfo } from '../src/helpers'

test('getInfo should return detected wallet', async t => {
  const info = await getInfo('detected')
  t.is(info?.name, 'Detected Wallet')
})
