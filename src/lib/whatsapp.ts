import axios from 'axios'

const WUZAPI_URL = process.env.WUZAPI_URL || ''
const WUZAPI_TOKEN = process.env.WUZAPI_TOKEN || ''

export interface WhatsAppMessage {
  to: string
  body: string
}

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<boolean> {
  if (!WUZAPI_URL || !WUZAPI_TOKEN) {
    console.log('WuzAPI not configured, skipping WhatsApp notification')
    return false
  }

  try {
    const formattedPhone = formatPhoneNumber(message.to)
    
    const response = await axios.post(
      `${WUZAPI_URL}/chat/send/text`,
      {
        Phone: formattedPhone,
        Body: message.body,
      },
      {
        headers: {
          'token': WUZAPI_TOKEN,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    console.log('WhatsApp sent successfully:', response.data)
    return true
  } catch (error: any) {
    console.error('WuzAPI WhatsApp error:', error.response?.status, error.response?.data || error.message)
    return false
  }
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('55') && cleaned.length >= 11) {
    return cleaned
  }
  
  if (cleaned.length === 11) {
    return `55${cleaned}`
  }
  
  if (cleaned.length === 10) {
    return `55${cleaned}`
  }
  
  return cleaned
}

export function createTransactionAlertMessage(
  type: 'in' | 'out',
  value: string,
  token: string,
  walletLabel: string,
  walletAddress: string,
  appUrl: string,
  timestamp?: string | Date
): string {
  const direction = type === 'in' ? 'RECEBIDO' : 'ENVIADO'
  const emoji = type === 'in' ? '📥' : '📤'
  
  let timeString = ''
  if (timestamp) {
    const date = new Date(timestamp)
    timeString = `\nData/Hora: ${date.toLocaleString('pt-BR')}`
  }
  
  return `${emoji} *Crypto Alert*

*${direction} ${parseFloat(value).toFixed(6)} ${token}*${timeString}

Carteira: ${walletLabel || 'Unknown'}
Endereço: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}

🔗 Ver detalhes: ${appUrl}/wallets`
}