import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface ContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({
  name,
  email,
  message,
}: ContactEmailParams): Promise<{ success: boolean; error?: string }> {
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!from || !to) {
    console.error('EMAIL_FROM or EMAIL_TO is not configured');
    return { success: false, error: 'Email configuration error' };
  }

  try {
    const { error } = await getResendClient().emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Contact daviani.dev] Message de ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E3440; border-bottom: 2px solid #5E81AC; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          <div style="background: #ECEFF4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Nom:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #D8DEE9; border-radius: 8px;">
            <h3 style="color: #4C566A; margin-top: 0;">Message:</h3>
            <p style="color: #2E3440; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #4C566A; font-size: 12px; margin-top: 20px;">
            Ce message a été envoyé depuis le formulaire de contact de daviani.dev
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
