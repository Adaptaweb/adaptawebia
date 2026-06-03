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
      const resend = new Resend(resendApiKey);

      try {
        await resend.emails.send({
          from: 'noreply@adaptaweb.cl',
          to: 'hola@adaptaweb.cl',
          subject: `Nuevo contacto de ${name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <table role="presentation" width="100%" style="background-color:#0a0a0a;padding:40px 20px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="600" style="max-width:600px;background-color:#121212;border-radius:16px;border:1px solid rgba(255,255,255,0.05);padding:40px;">
                      <tr>
                        <td align="center" style="padding-bottom:28px;">
                          <img src="https://adaptaweb.cl/logo.webp" alt="AdaptaWeb" width="48" height="48" style="border-radius:12px;opacity:0.9;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom:32px;">
                          <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Nuevo contacto</h1>
                          <p style="margin:8px 0 0;font-size:14px;color:#888888;">recibido desde adaptaweb.cl</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 8px;">
                          <table role="presentation" width="100%" style="border-collapse:separate;border-spacing:0 1px;">
                            <tr>
                              <td style="padding:14px 18px;background-color:#1a1a1a;border-radius:10px 10px 0 0;">
                                <p style="margin:0;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Nombre</p>
                                <p style="margin:4px 0 0;font-size:15px;color:#ffffff;font-weight:500;">${name}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:14px 18px;background-color:#1a1a1a;">
                                <p style="margin:0;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Email</p>
                                <p style="margin:4px 0 0;font-size:15px;color:#ffffff;font-weight:500;">${email}</p>
                              </td>
                            </tr>
                            ${company ? `<tr>
                              <td style="padding:14px 18px;background-color:#1a1a1a;">
                                <p style="margin:0;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Empresa</p>
                                <p style="margin:4px 0 0;font-size:15px;color:#ffffff;font-weight:500;">${company}</p>
                              </td>
                            </tr>` : ''}
                            <tr>
                              <td style="padding:14px 18px;background-color:#1a1a1a;border-radius:0 0 10px 10px;">
                                <p style="margin:0;font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Mensaje</p>
                                <p style="margin:4px 0 0;font-size:14px;color:#cccccc;line-height:1.7;">${message}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.05);">
                          <p style="margin:0;font-size:12px;color:#555555;">
                            &copy; 2026 AdaptaWeb &middot; <a href="https://adaptaweb.cl" style="color:#45FF8C;text-decoration:none;">adaptaweb.cl</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
      } catch (emailErr) {
        console.error('Error sending notification email:', emailErr);
      }

      try {
        await resend.emails.send({
          from: 'noreply@adaptaweb.cl',
          to: email,
          subject: 'Hemos recibido tu mensaje — AdaptaWeb',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <table role="presentation" width="100%" style="background-color:#0a0a0a;padding:40px 20px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="600" style="max-width:600px;background-color:#121212;border-radius:16px;border:1px solid rgba(255,255,255,0.05);padding:40px;">
                      <tr>
                        <td align="center" style="padding-bottom:28px;">
                          <img src="https://adaptaweb.cl/logo.webp" alt="AdaptaWeb" width="48" height="48" style="border-radius:12px;opacity:0.9;" />
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom:16px;">
                          <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">¡Gracias por contactarnos, ${name.split(' ')[0]}!</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 24px;">
                          <p style="margin:0;font-size:15px;color:#cccccc;line-height:1.7;text-align:center;">
                            Hemos recibido tu mensaje correctamente. Nuestro equipo revisará tu solicitud y te contactaremos a la brevedad dentro de nuestro horario de atención.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 24px;">
                          <table role="presentation" width="100%" style="background-color:#1a1a1a;border-radius:10px;padding:20px;">
                            <tr>
                              <td align="center">
                                <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
                                  <strong style="color:#ffffff;">Horario de atención:</strong><br />
                                  Lunes a viernes — 09:00 a 18:00
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 24px;">
                          <p style="margin:0;font-size:14px;color:#888888;line-height:1.7;text-align:center;">
                            ¿Necesitas más ayuda? Escríbenos directamente a<br />
                            <a href="mailto:hola@adaptaweb.cl" style="color:#45FF8C;text-decoration:none;font-weight:500;">hola@adaptaweb.cl</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 8px;">
                          <p style="margin:0;font-size:14px;color:#cccccc;line-height:1.7;text-align:center;">
                            Un abrazo,<br />
                            <strong style="color:#ffffff;">Equipo AdaptaWeb</strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.05);">
                          <p style="margin:0;font-size:12px;color:#555555;">
                            &copy; 2026 AdaptaWeb &middot; <a href="https://adaptaweb.cl" style="color:#45FF8C;text-decoration:none;">adaptaweb.cl</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
      } catch (emailErr) {
        console.error('Error sending confirmation email:', emailErr);
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
