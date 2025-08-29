import twilio from 'twilio';

// Se crea el cliente de Twilio usando las credenciales del entorno.
const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

/**
 * Envía un mensaje de WhatsApp usando la API de Twilio.
 * @param sender - Número de destino (incluyendo código de país).
 * @param message - Texto del mensaje a enviar.
 * @throws Error si ocurre algún problema al enviar el mensaje.
 */
export async function sendWhatsAppMessage(sender: string, message: string): Promise<void> {
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER!,
      body: message,
      to: `whatsapp:+${sender}`
    });
    console.log('Mensaje enviado a:', sender);
  } catch (error: any) {
    console.error('Error enviando mensaje:', error);
    if (error.status) {
        console.error(`Código de error Twilio: ${error.status}`);
    }
    throw error;
  }
}