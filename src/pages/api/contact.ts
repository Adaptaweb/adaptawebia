import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface ContactBody {
  name: string;
  company: string;
  email: string;
  message: string;
  turnstileToken: string;
}

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ContactBody = await request.json();
    const { name, company, email, message, turnstileToken } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim() || !turnstileToken) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos obligatorios deben ser completados' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: turnstileToken,
        }),
      },
    );

    const verifyData: TurnstileResponse = await verifyRes.json();

    if (!verifyData.success) {
      return new Response(
        JSON.stringify({ error: 'Verificación de seguridad fallida. Por favor intenta de nuevo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'contacto@adaptaweb.cl',
          to: 'hola@adaptaweb.cl',
          subject: `Nuevo contacto de ${name}`,
          html: `
            <h2>Nuevo mensaje desde adaptaweb.cl</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch (emailErr) {
        console.error('Error sending email via Resend:', emailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
