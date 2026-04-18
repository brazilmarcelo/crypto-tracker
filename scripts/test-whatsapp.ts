import { sendWhatsAppMessage, createTransactionAlertMessage } from '../src/lib/whatsapp'

const msg = createTransactionAlertMessage(
  'in',
  '0.025',
  'ETH',
  'Carteira Teste',
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  'http://localhost:3000'
)

console.log('Message:', msg)

sendWhatsAppMessage({ to: '5517991656664', body: msg }).then((result) => {
  console.log('Sent:', result)
  process.exit(0)
}).catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})