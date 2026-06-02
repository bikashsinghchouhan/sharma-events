import nodemailer from 'nodemailer';

/**
 * Sends a notification email to the event planner.
 * @param {Object} details - Details of the client inquiry.
 * @param {string} details.name - Name of the inquirer.
 * @param {string} details.email - Email of the inquirer.
 * @param {string} [details.phone] - Phone number.
 * @param {string} [details.eventDate] - Date of the event.
 * @param {string} details.message - Event details/message.
 */
export async function sendNotificationEmail({ name, email, phone, eventDate, message }) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFICATION_EMAIL || 'bikashkrsin22@gmail.com';

  if (!user || !pass) {
    console.warn('[EMAIL NOTIFICATION] SMTP_USER or SMTP_PASS environment variables are not configured. Skipping email delivery.');
    return false;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 / other ports
    auth: {
      user,
      pass,
    },
  });

  // Branded HTML email body design (matches site aesthetics)
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #f3f4f6; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08);">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px;">
        <h2 style="color: #06b6d4; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
          SHARMA<span style="color: #a855f7;">EVENTS</span>
        </h2>
        <p style="color: #9ca3af; font-size: 11px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">New Website Contact Inquiry</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="font-size: 15px; line-height: 1.6; color: #e5e7eb; margin: 0;">You have received a new event inquiry from the website contact form.</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #9ca3af; font-weight: bold; width: 130px; font-size: 13px; text-transform: uppercase;">Client Name:</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #9ca3af; font-weight: bold; font-size: 13px; text-transform: uppercase;">Email Address:</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #06b6d4; font-size: 14px; font-weight: 600;">
            <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #9ca3af; font-weight: bold; font-size: 13px; text-transform: uppercase;">Phone Number:</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff; font-size: 14px;">
            ${phone ? `<a href="tel:${phone}" style="color: #ffffff; text-decoration: none; font-weight: 600;">${phone}</a>` : '<span style="color: #4b5563; font-style: italic;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #9ca3af; font-weight: bold; font-size: 13px; text-transform: uppercase;">Event Date:</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #a855f7; font-size: 14px; font-weight: 700;">
            ${eventDate || '<span style="color: #4b5563; font-style: italic;">Not specified</span>'}
          </td>
        </tr>
      </table>
      
      <div style="background: rgba(255, 255, 255, 0.02); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.06); margin-bottom: 30px;">
        <h4 style="margin: 0 0 12px 0; color: #06b6d4; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Requirements & Message</h4>
        <p style="margin: 0; color: #d1d5db; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
      
      <div style="text-align: center; font-size: 11px; color: #4b5563; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; margin-top: 10px;">
        This is an automated notification sent from the website contact system of <a href="https://sharmaevents.co.in" style="color: #9ca3af; text-decoration: underline;">sharmaevents.co.in</a>.
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Sharma Events Contacts" <${user}>`,
    to,
    replyTo: email,
    subject: `[INQUIRY] New Event Message from ${name}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL NOTIFICATION] Notification email delivered successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL NOTIFICATION] Failed to deliver notification email:', error);
    return false;
  }
}
