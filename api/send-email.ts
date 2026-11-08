import type { IncomingMessage, ServerResponse } from 'http';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

interface SendEmailPayload {
  to?: string;
  lead: {
    id: string;
    type: string;
    name: string;
    email: string;
    phone: string;
    package?: string;
    preferredDate?: string;
    gender?: string;
    birthDate?: string;
    birthPlace?: string;
    address?: string;
    postalCity?: string;
    notes?: string;
    message?: string;
    createdAt?: string;
  };
}

export async function handleSendEmail(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data: SendEmailPayload = JSON.parse(body);
      const lead = data.lead;

      const resendApiKey = process.env.RESEND_API_KEY;
      const rawRecipients = process.env.NOTIFICATION_EMAIL || data.to || 'info@rijschoolteez.nl';
      const toRecipients = rawRecipients.split(',').map((s) => s.trim()).filter(Boolean);
      const fromEmail = process.env.FROM_EMAIL || 'Rijschool TEEZ <noreply@rijschoolteez.nl>';

      // Type title in Dutch
      const typeTitles: Record<string, string> = {
        registration: 'Aanmelding Rijschool TEEZ',
        trial_lesson: 'Aanvraag Gratis Proefles',
        callback: 'Terugbelverzoek',
        contact: 'Contactbericht',
      };
      const title = typeTitles[lead.type] || 'Nieuw bericht';
      const subject = `[${title}] ${lead.name} ${lead.package ? `- ${lead.package}` : ''}`;

      // Build HTML Email for Instructor
      const instructorHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #001a33; padding: 24px; text-align: center;">
            <h1 style="color: #ffea00; margin: 0; font-size: 24px; letter-spacing: 1px;">RIJSCHOOL TEEZ</h1>
            <p style="color: #ffffff; margin: 6px 0 0; font-size: 14px;">${title}</p>
          </div>
          
          <div style="padding: 24px; background-color: #ffffff;">
            <h2 style="font-size: 18px; color: #001a33; margin-top: 0; border-bottom: 2px solid #ffea00; padding-bottom: 8px;">
              Gegevens van de kandidaat
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.8;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Naam:</strong></td>
                <td style="padding: 6px 0; color: #001a33;"><strong>${lead.name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Telefoon:</strong></td>
                <td style="padding: 6px 0;"><a href="tel:${lead.phone}" style="color: #001a33; font-weight: bold;">${lead.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>E-mail:</strong></td>
                <td style="padding: 6px 0;"><a href="mailto:${lead.email}" style="color: #001a33;">${lead.email}</a></td>
              </tr>
              ${lead.package ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Pakketkeuze:</strong></td>
                <td style="padding: 6px 0; color: #0284c7; font-weight: bold;">${lead.package}</td>
              </tr>` : ''}
              ${lead.preferredDate ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Voorkeursdatum:</strong></td>
                <td style="padding: 6px 0; color: #001a33;">${lead.preferredDate}</td>
              </tr>` : ''}
              ${lead.gender ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Geslacht:</strong></td>
                <td style="padding: 6px 0; color: #001a33;">${lead.gender}</td>
              </tr>` : ''}
              ${lead.birthDate ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Geboortedatum:</strong></td>
                <td style="padding: 6px 0; color: #001a33;">${lead.birthDate} ${lead.birthPlace ? `(${lead.birthPlace})` : ''}</td>
              </tr>` : ''}
              ${lead.address ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Adres:</strong></td>
                <td style="padding: 6px 0; color: #001a33;">${lead.address}, ${lead.postalCity}</td>
              </tr>` : ''}
              ${(lead.message || lead.notes) ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong>Opmerking / Vraag:</strong></td>
                <td style="padding: 6px 0; color: #001a33; font-style: italic;">${lead.message || lead.notes}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Datum aanvraag:</strong></td>
                <td style="padding: 6px 0; color: #64748b;">${new Date().toLocaleString('nl-NL')}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 6px; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 13px; color: #64748b;">Snelle instructeursactie:</p>
              <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="background-color: #25D366; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; margin-right: 8px;">
                Stuur WhatsApp
              </a>
              <a href="tel:${lead.phone}" style="background-color: #001a33; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
                Bel direct
              </a>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
            Verzonden via Rijschool TEEZ notificatiesysteem naar ${toRecipients.join(', ')}
          </div>
        </div>
      `;

      // Build HTML Confirmation Email for Student / Customer
      const studentSubject = lead.type === 'registration'
        ? 'Bevestiging van je aanmelding bij Rijschool TEEZ'
        : lead.type === 'trial_lesson'
        ? 'Aanvraag gratis proefles ontvangen - Rijschool TEEZ'
        : 'We hebben je bericht ontvangen - Rijschool TEEZ';

      const studentHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b;">
          <div style="background-color: #001a33; padding: 24px; text-align: center;">
            <h1 style="color: #ffea00; margin: 0; font-size: 24px; letter-spacing: 1px;">RIJSCHOOL TEEZ</h1>
            <p style="color: #ffffff; margin: 6px 0 0; font-size: 14px;">Bedankt voor je aanvraag!</p>
          </div>
          
          <div style="padding: 28px; background-color: #ffffff;">
            <h2 style="font-size: 18px; color: #001a33; margin-top: 0;">Beste ${lead.name},</h2>
            
            <p style="font-size: 15px; line-height: 1.6; color: #334155;">
              ${lead.type === 'registration' 
                ? 'Hartelijk dank voor je aanmelding bij Rijschool TEEZ! We hebben je inschrijving succesvol ontvangen.'
                : lead.type === 'trial_lesson'
                ? 'Wat leuk dat je hebt gekozen voor een gratis proefles bij Rijschool TEEZ! We hebben je aanvraag in goede orde ontvangen.'
                : 'Bedankt voor je bericht aan Rijschool TEEZ. We hebben je vraag goed ontvangen.'
              }
            </p>

            <div style="background-color: #f8fafc; border-left: 4px solid #ffea00; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                <strong>Wat gebeurt er nu?</strong><br>
                Instructeur Fawad neemt zo spoedig mogelijk (meestal binnen 24 uur) telefonisch of via WhatsApp contact met je op om kennis te maken en je les in te plannen.
              </p>
            </div>

            ${lead.package ? `
              <div style="margin-bottom: 20px; font-size: 14px; color: #475569;">
                <strong>Gekozen rijlespakket:</strong> <span style="color: #0284c7; font-weight: bold;">${lead.package}</span>
              </div>
            ` : ''}

            <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
              Heb je al een vraag of wil je direct iets afstemmen? Je kunt instructeur Fawad altijd direct bereiken via WhatsApp of bellen op <a href="tel:0681819484" style="color: #001a33; font-weight: bold; text-decoration: none;">06 818 194 84</a>.
            </p>

            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #64748b;">
              Met vriendelijke groet,<br>
              <strong style="color: #001a33; font-size: 15px;">Fawad Ahmadyar</strong><br>
              <span style="font-size: 13px;">Rijschool TEEZ • Enschede, Hengelo & Twente</span><br>
              <a href="https://rijschoolteez.nl" style="color: #0284c7; font-size: 13px; text-decoration: none;">www.rijschoolteez.nl</a>
            </div>
          </div>
        </div>
      `;

      // 1. Preferred: Resend API
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);

        // Send Notification Email to Instructor(s)
        const { data: resendData, error: resendError } = await resend.emails.send({
          from: fromEmail,
          to: toRecipients,
          replyTo: lead.email,
          subject: subject,
          html: instructorHtml,
        });

        if (resendError) {
          console.error('[Resend Error]', resendError);
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: resendError.message, details: resendError }));
          return;
        }

        console.log('[Resend Instructor Notification Sent]:', resendData?.id);

        // Send Confirmation / Thank-you Email to Customer if valid email provided
        if (lead.email && lead.email.includes('@') && !lead.email.includes('example.com')) {
          resend.emails.send({
            from: fromEmail,
            to: [lead.email],
            replyTo: 'info@rijschoolteez.nl',
            subject: studentSubject,
            html: studentHtml,
          }).then((r) => {
            console.log('[Resend Student Confirmation Sent]:', r.data?.id);
          }).catch((err) => {
            console.warn('[Resend Student Confirmation Error]:', err);
          });
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, messageId: resendData?.id }));
        return;
      }

      // 2. Fallback: Google Workspace SMTP
      const senderEmail = process.env.GOOGLE_EMAIL || 'info@autoflowstudio.net';
      const senderPassword = process.env.GOOGLE_APP_PASSWORD || '';

      if (senderPassword) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: senderEmail,
            pass: senderPassword,
          },
        });

        const info = await transporter.sendMail({
          from: `"Rijschool TEEZ" <${senderEmail}>`,
          to: toRecipients.join(', '),
          replyTo: lead.email,
          subject: subject,
          html: instructorHtml,
        });

        console.log('[Google Workspace SMTP Sent]:', info.messageId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, messageId: info.messageId }));
        return;
      }

      // 3. Fallback: Simulated Send
      console.log(`[Sendmail Simulated Mode]:`);
      console.log(`To: ${toRecipients.join(', ')} | Subject: ${subject}`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        mode: 'simulated',
        message: 'Simulated send: RESEND_API_KEY or GOOGLE_APP_PASSWORD not set.',
      }));
    } catch (err: unknown) {
      console.error('[Sendmail Server Error]', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: String(err) }));
    }
  });
}

// Default export for Vercel Serverless Function
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleSendEmail(req, res);
}
