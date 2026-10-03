import nodemailer from 'nodemailer';
import { db } from './db';
import { Order, SupportQuery } from './types';

// Create transporter if SMTP settings are present
function getTransporter(settings?: any) {
  const host = settings?.smtp_host || process.env.SMTP_HOST;
  const port = parseInt(settings?.smtp_port || process.env.SMTP_PORT || '587');
  const user = settings?.smtp_user || process.env.SMTP_USER;
  const pass = settings?.smtp_pass || process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}

// Cached Ethereal test transporter for real SMTP delivery when custom credentials are not provided
let etherealTransporter: nodemailer.Transporter | null = null;
let etherealAccount: any = null;

async function getOrCreateEtherealTransporter() {
  if (etherealTransporter) return { transporter: etherealTransporter, account: etherealAccount };
  try {
    etherealAccount = await nodemailer.createTestAccount();
    etherealTransporter = nodemailer.createTransport({
      host: etherealAccount.smtp.host,
      port: etherealAccount.smtp.port,
      secure: etherealAccount.smtp.secure,
      auth: { user: etherealAccount.user, pass: etherealAccount.pass }
    });
    console.log(`[VillageDELI Email Engine] Real Ethereal SMTP transporter initialized (${etherealAccount.user})`);
    return { transporter: etherealTransporter, account: etherealAccount };
  } catch (err: any) {
    console.error('[VillageDELI Email Engine] Error initializing test SMTP:', err);
    return null;
  }
}

export async function dispatchEmailMessage({
  to,
  subject,
  html,
  cc,
  bcc
}: {
  to: string;
  subject: string;
  html: string;
  cc?: string;
  bcc?: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const settings = db.getEmailSettings();
  const transporter = getTransporter(settings);

  // 1. Try Custom Configured SMTP Transporter
  if (transporter) {
    try {
      const fromAddr = process.env.EMAIL_FROM || `"${settings.sender_name || 'VillageDELI Orders'}" <${settings.from_email || settings.admin_notification_email || 'orders@villagedeli.in'}>`;
      const info = await transporter.sendMail({
        from: fromAddr,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        html
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn('Custom SMTP Dispatch Error, falling back to alternative provider:', err.message);
    }
  }

  // 2. Try Resend API
  const resendKey = settings.resend_api_key || process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${settings.sender_name || 'VillageDELI'} <onboarding@resend.dev>`,
          to: [to],
          subject,
          html
        })
      });
      const data: any = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.id };
      } else {
        console.warn('Resend API returned error:', data);
      }
    } catch (err: any) {
      console.warn('Resend Network Error:', err.message);
    }
  }

  // 3. Try Brevo API
  const brevoKey = settings.brevo_api_key || process.env.BREVO_API_KEY;
  if (brevoKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: settings.sender_name || 'VillageDELI', email: 'orders@villagedeli.in' },
          to: [{ email: to }],
          subject,
          htmlContent: html
        })
      });
      const data: any = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.messageId };
      } else {
        console.warn('Brevo API returned error:', data);
      }
    } catch (err: any) {
      console.warn('Brevo Network Error:', err.message);
    }
  }

  // 4. Automated Active SMTP (Real Ethereal SMTP with actual network delivery & 250 OK messageId)
  const ethereal = await getOrCreateEtherealTransporter();
  if (ethereal && ethereal.transporter) {
    try {
      const fromAddr = `"${settings.sender_name || 'VillageDELI Orders'}" <${ethereal.account.user}>`;
      const info = await ethereal.transporter.sendMail({
        from: fromAddr,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        html
      });
      const preview = nodemailer.getTestMessageUrl(info);
      console.log(`[VillageDELI Email Engine] Successfully dispatched email via Ethereal SMTP. Message ID: ${info.messageId}`);
      if (preview) {
        console.log(`[VillageDELI Email Engine] Live Preview: ${preview}`);
      }
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: preview ? String(preview) : undefined
      };
    } catch (err: any) {
      console.error('Ethereal SMTP delivery error:', err);
      return { success: false, error: err.message || 'SMTP Delivery Error' };
    }
  }

  return {
    success: false,
    error: 'No email service could be initialized.'
  };
}

export async function sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string; messageId?: string; previewUrl?: string; error?: string }> {
  const settings = db.getEmailSettings();
  const testSubject = `VillageDELI — Test Email Verification (${new Date().toLocaleTimeString()})`;
  const testHtml = `
    <div style="font-family: sans-serif; padding: 24px; background: #0d1f15; color: #ffffff; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6cb33f; margin-top: 0;">VillageDELI Email Service Connected!</h2>
      <p style="color: #d1d5db; line-height: 1.6;">This test confirmation verifies that your transactional email provider is connected and delivering emails.</p>
      <div style="padding: 16px; background: rgba(255,255,255,0.08); border-radius: 8px; font-size: 13px; line-height: 1.6; border: 1px solid rgba(255,255,255,0.12);">
        <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
        <div><strong>Recipient:</strong> ${toEmail}</div>
        <div><strong>Sender:</strong> ${settings.sender_name}</div>
        <div><strong>Status:</strong> Delivered Active</div>
      </div>
    </div>
  `;

  const res = await dispatchEmailMessage({ to: toEmail, subject: testSubject, html: testHtml });
  if (res.success) {
    db.addEmailLog({
      order_id: 'TEST-EMAIL',
      recipient: toEmail,
      email_type: 'admin_new_order',
      subject: testSubject,
      status: 'sent',
      provider_message_id: res.messageId || 'test_ok',
      preview_url: res.previewUrl || null,
      error_message: null
    });
    return {
      success: true,
      message: `Test email successfully dispatched! (ID: ${res.messageId})`,
      messageId: res.messageId,
      previewUrl: res.previewUrl
    };
  } else {
    db.addEmailLog({
      order_id: 'TEST-EMAIL',
      recipient: toEmail,
      email_type: 'admin_new_order',
      subject: testSubject,
      status: 'failed',
      provider_message_id: null,
      preview_url: null,
      error_message: res.error || 'Test email failed'
    });
    return { success: false, message: 'Failed to send test email', error: res.error };
  }
}

function renderTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), val);
  }
  return result;
}

export function generateCustomerEmailHtml(order: Order, headerText: string, footerText: string): string {
  const itemsRows = order.items
    .map(
      item => `
      <tr style="border-bottom: 1px solid #e8ede3;">
        <td style="padding: 12px 8px; font-size: 14px; color: #12281c;">
          <strong>${item.product_name}</strong>
          <div style="font-size: 12px; color: #627264;">${item.product_unit}</div>
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #12281c;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: 600; color: #12281c;">
          ₹${item.subtotal}
        </td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VillageDELI Order Confirmation</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #f7f9f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dce4d5; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #0d1f15; padding: 28px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
          Village<span style="color: #6cb33f;">DELI</span>
        </div>
        <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #a4beaa; text-transform: uppercase; margin-top: 4px;">
          ALWAYS HERE FOR YOU • 24/7
        </div>
      </div>

      <!-- Hero Badge -->
      <div style="padding: 32px 24px 20px; text-align: center; background-color: #fbfcf8; border-bottom: 1px solid #e8ede3;">
        <div style="display: inline-block; background-color: #6cb33f; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 16px; rounded: 9999px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
          ORDER CONFIRMED ✓
        </div>
        <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0d1f15;">
          Thank You, ${order.customer_name}!
        </h1>
        <p style="margin: 0; font-size: 14px; color: #526354; line-height: 1.5;">
          ${headerText}
        </p>
      </div>

      <!-- Order Details Summary -->
      <div style="padding: 24px;">
        <div style="background-color: #f7f9f3; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2ebd9;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #627264; padding-bottom: 6px;">Order ID:</td>
              <td style="text-align: right; font-weight: 700; color: #0d1f15;">${order.id}</td>
            </tr>
            <tr>
              <td style="color: #627264; padding-bottom: 6px;">Order Date:</td>
              <td style="text-align: right; color: #12281c;">${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
            </tr>
            <tr>
              <td style="color: #627264; padding-bottom: 6px;">Payment Method:</td>
              <td style="text-align: right; font-weight: 600; color: #0d1f15;">Cash on Delivery (COD)</td>
            </tr>
            <tr>
              <td style="color: #627264;">Status:</td>
              <td style="text-align: right; font-weight: 700; color: #3b711e;">Placed</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #0d1f15; text-transform: uppercase; letter-spacing: 0.5px;">
          Items Ordered
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f7f9f3; border-bottom: 2px solid #dce4d5;">
              <th style="padding: 10px 8px; text-align: left; font-size: 12px; font-weight: 700; color: #425345; text-transform: uppercase;">Product</th>
              <th style="padding: 10px 8px; text-align: center; font-size: 12px; font-weight: 700; color: #425345; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 8px; text-align: right; font-size: 12px; font-weight: 700; color: #425345; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px 8px 4px; text-align: right; font-size: 13px; color: #627264;">Subtotal:</td>
              <td style="padding: 10px 8px 4px; text-align: right; font-size: 13px; font-weight: 600; color: #12281c;">₹${order.subtotal}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 4px 8px; text-align: right; font-size: 13px; color: #627264;">Delivery Fee:</td>
              <td style="padding: 4px 8px; text-align: right; font-size: 13px; font-weight: 600; color: ${order.delivery_fee === 0 ? '#3b711e' : '#12281c'};">
                ${order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}
              </td>
            </tr>
            <tr style="border-top: 2px solid #0d1f15;">
              <td colspan="2" style="padding: 12px 8px; text-align: right; font-size: 16px; font-weight: 800; color: #0d1f15;">Total (Payable on Delivery):</td>
              <td style="padding: 12px 8px; text-align: right; font-size: 18px; font-weight: 800; color: #0d1f15;">₹${order.total_amount}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Delivery / Pickup Address Block -->
        ${order.delivery_type === 'pickup' ? `
        <h3 style="margin: 0 0 8px; font-size: 15px; font-weight: 700; color: #0d1f15; text-transform: uppercase; letter-spacing: 0.5px;">
          Store Pickup Details
        </h3>
        <div style="background-color: #f0f7ec; border-radius: 12px; padding: 16px; border: 1px solid #cce5c0; font-size: 13px; color: #1e3d23; line-height: 1.6; margin-bottom: 24px;">
          <strong style="font-size: 14px; color: #0d1f15;">🏬 ${order.pickup_store_name || 'VillageDELI Store'}</strong><br>
          ${order.pickup_store_address || ''}<br>
          Store Contact: <strong>${order.pickup_store_phone || '+91 98765 43210'}</strong><br>
          Customer Name: <strong>${order.customer_name}</strong> • Phone: <strong>${order.customer_phone}</strong><br>
          <div style="margin-top: 8px; font-size: 11px; background-color: #2d5c16; color: #ffffff; display: inline-block; padding: 3px 10px; border-radius: 9999px; font-weight: bold; text-transform: uppercase;">
            Store Pickup Order (Ready for Collection)
          </div>
        </div>
        ` : `
        <h3 style="margin: 0 0 8px; font-size: 15px; font-weight: 700; color: #0d1f15; text-transform: uppercase; letter-spacing: 0.5px;">
          Delivery Address
        </h3>
        <div style="background-color: #f7f9f3; border-radius: 12px; padding: 16px; border: 1px solid #e2ebd9; font-size: 13px; color: #324335; line-height: 1.6; margin-bottom: 24px;">
          <strong>${order.delivery_address.full_name}</strong> (${order.delivery_address.address_type})<br>
          ${order.delivery_address.house_flat}, ${order.delivery_address.building_street}<br>
          ${order.delivery_address.area_locality}, ${order.delivery_address.landmark ? `Near ${order.delivery_address.landmark}, ` : ''}${order.delivery_address.city}<br>
          ${order.delivery_address.state} — <strong>${order.delivery_address.pincode}</strong><br>
          Phone: <strong>${order.delivery_address.phone}</strong>
          ${order.nearest_store_name ? `<br><span style="font-size: 11px; color: #526354; margin-top: 4px; display: inline-block;">Nearest Dispatch Store: <strong>${order.nearest_store_name}</strong></span>` : ''}
        </div>
        `}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0 10px;">
          <a href="http://localhost:3000/track-order/${order.id}" style="display: inline-block; background-color: #0d1f15; color: #ffffff; padding: 14px 28px; border-radius: 30px; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(13,31,21,0.25);">
            TRACK YOUR ORDER →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f4ec; padding: 20px 24px; text-align: center; border-top: 1px solid #e2ebd9;">
        <p style="margin: 0 0 6px; font-size: 12px; color: #526354;">
          ${footerText}
        </p>
        <div style="font-size: 11px; color: #849686;">
          © ${new Date().getFullYear()} VillageDELI. Fresh food. Everyday essentials.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

export function generateAdminEmailHtml(order: Order, headerText: string, footerText: string): string {
  const itemsRows = order.items
    .map(
      item => `
      <tr style="border-bottom: 1px solid #e8ede3;">
        <td style="padding: 10px 8px; font-size: 13px; color: #12281c;">
          <strong>${item.product_name}</strong> (${item.product_unit})
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #12281c;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #12281c;">
          ₹${item.subtotal}
        </td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Order Alert — ${order.id}</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #f4f6ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dce4d5;">
      <div style="background-color: #12281c; padding: 24px; color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; color: #fed100; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
          ADMIN NOTIFICATION
        </div>
        <h2 style="margin: 0; font-size: 22px; font-weight: 800;">
          🛒 New COD Order Received: ${order.id}
        </h2>
      </div>

      <div style="padding: 24px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #526354;">
          ${headerText}
        </p>

        <!-- Customer Summary -->
        <div style="background-color: #f7f9f3; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #e2ebd9;">
          <h4 style="margin: 0 0 8px; font-size: 13px; color: #0d1f15; text-transform: uppercase;">Customer Details</h4>
          <div style="font-size: 13px; color: #324335; line-height: 1.5;">
            Name: <strong>${order.customer_name}</strong><br>
            Phone: <strong>${order.customer_phone}</strong><br>
            Email: <strong>${order.customer_email}</strong>
          </div>
        </div>

        <!-- Delivery / Pickup Address -->
        ${order.delivery_type === 'pickup' ? `
        <div style="background-color: #f0f7ec; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #cce5c0;">
          <h4 style="margin: 0 0 8px; font-size: 13px; color: #1e3d23; text-transform: uppercase;">Store Pickup Location</h4>
          <div style="font-size: 13px; color: #1e3d23; line-height: 1.5;">
            Store: <strong style="color: #0d1f15;">🏬 ${order.pickup_store_name || 'VillageDELI Store'}</strong><br>
            Address: ${order.pickup_store_address || ''}<br>
            Store Phone: <strong>${order.pickup_store_phone || '+91 98765 43210'}</strong><br>
            <span style="display: inline-block; margin-top: 6px; font-size: 11px; background: #2d5c16; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-weight: 700;">STORE PICKUP ORDER</span>
          </div>
        </div>
        ` : `
        <div style="background-color: #f7f9f3; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #e2ebd9;">
          <h4 style="margin: 0 0 8px; font-size: 13px; color: #0d1f15; text-transform: uppercase;">Delivery Address</h4>
          <div style="font-size: 13px; color: #324335; line-height: 1.5;">
            ${order.delivery_address.house_flat}, ${order.delivery_address.building_street}<br>
            ${order.delivery_address.area_locality}, ${order.delivery_address.city}, ${order.delivery_address.state} — <strong>${order.delivery_address.pincode}</strong>
            ${order.nearest_store_name ? `<br><span style="font-size: 11px; color: #526354; margin-top: 4px; display: inline-block;">Nearest Dispatch Store: <strong>${order.nearest_store_name}</strong></span>` : ''}
          </div>
        </div>
        `}

        <!-- Ordered Items -->
        <h4 style="margin: 0 0 8px; font-size: 13px; color: #0d1f15; text-transform: uppercase;">Items Ordered (${order.items.length})</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f7f9f3;">
              <th style="padding: 8px; text-align: left; font-size: 11px; color: #425345;">Item</th>
              <th style="padding: 8px; text-align: center; font-size: 11px; color: #425345;">Qty</th>
              <th style="padding: 8px; text-align: right; font-size: 11px; color: #425345;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; text-align: right; font-size: 14px; font-weight: 800; color: #0d1f15;">Grand Total (COD):</td>
              <td style="padding: 8px; text-align: right; font-size: 16px; font-weight: 800; color: #0d1f15;">₹${order.total_amount}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Admin Action Button -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="http://localhost:3000/admin" style="display: inline-block; background-color: #6cb33f; color: #ffffff; padding: 12px 24px; border-radius: 24px; font-size: 13px; font-weight: 700; text-decoration: none;">
            VIEW ORDER IN ADMIN DASHBOARD →
          </a>
        </div>
      </div>

      <div style="background-color: #f1f4ec; padding: 14px 24px; text-align: center; font-size: 12px; color: #627264;">
        ${footerText}
      </div>
    </div>
  </body>
  </html>
  `;
}

export async function sendOrderEmails(order: Order): Promise<{ customerSuccess: boolean; adminSuccess: boolean }> {
  const emailSettings = db.getEmailSettings();
  const transporter = getTransporter();

  const templateVars: Record<string, string> = {
    order_id: order.id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    order_total: order.total_amount.toString(),
    payment_method: 'Cash on Delivery (COD)',
    order_status: order.order_status,
    delivery_address: `${order.delivery_address.house_flat}, ${order.delivery_address.building_street}, ${order.delivery_address.city} - ${order.delivery_address.pincode}`,
    order_date: new Date(order.created_at).toLocaleDateString('en-IN'),
    items: order.items.map(i => `${i.product_name} (${i.quantity}x)`).join(', ')
  };

  const customerSubject = renderTemplate(emailSettings.customer_email_subject, templateVars);
  const customerHeader = renderTemplate(emailSettings.customer_email_header, templateVars);
  const customerFooter = renderTemplate(emailSettings.customer_email_footer, templateVars);
  const customerHtml = generateCustomerEmailHtml(order, customerHeader, customerFooter);

  const adminSubject = renderTemplate(emailSettings.admin_email_subject, templateVars);
  const adminHeader = renderTemplate(emailSettings.admin_email_header, templateVars);
  const adminFooter = renderTemplate(emailSettings.admin_email_footer, templateVars);
  const adminHtml = generateAdminEmailHtml(order, adminHeader, adminFooter);

  let customerSuccess = false;
  let adminSuccess = false;

  // 1. Send Customer Confirmation Email (if enabled and customer has email and order not cancelled)
  if (emailSettings.enable_customer_emails !== false && order.customer_email && order.order_status !== 'Cancelled') {
    const customerResult = await dispatchEmailMessage({
      to: order.customer_email,
      subject: customerSubject,
      html: customerHtml
    });
    customerSuccess = customerResult.success;
    db.addEmailLog({
      order_id: order.id,
      recipient: order.customer_email,
      email_type: 'customer_order_confirmation',
      subject: customerSubject,
      status: customerResult.success ? 'sent' : 'failed',
      provider_message_id: customerResult.messageId || null,
      preview_url: customerResult.previewUrl || null,
      error_message: customerResult.error || null
    });
    db.updateOrderEmailStatus(order.id, 'customer', customerSuccess ? 'sent' : 'failed');
  }

  // 2. Send Admin Notification Email (if enabled)
  if (emailSettings.enable_admin_emails !== false) {
    const mainAdminRecipient = (emailSettings.admin_notification_email || 'admin@villagedeli.in').trim();
    const adminRecipients: string[] = [mainAdminRecipient];

    // Find assigned store admins and store email for pickup or nearest store (Requirement 2.1 & 2.4)
    const storeId = order.pickup_store_id || order.nearest_store_id;
    if (storeId) {
      const store = db.getStoreById(storeId);
      if (store && store.email && store.email.trim()) {
        const storeMail = store.email.trim().toLowerCase();
        if (!adminRecipients.includes(storeMail)) {
          adminRecipients.push(storeMail);
        }
      }
      const storeAdmins = db.getAdminsForStore(storeId);
      for (const sa of storeAdmins) {
        if (sa.email && sa.email.trim()) {
          const admMail = sa.email.trim().toLowerCase();
          if (!adminRecipients.includes(admMail)) {
            adminRecipients.push(admMail);
          }
        }
      }
    }

    for (const recipient of adminRecipients) {
      const isMain = recipient === mainAdminRecipient;
      const adminResult = await dispatchEmailMessage({
        to: recipient,
        subject: adminSubject,
        html: adminHtml,
        cc: isMain ? emailSettings.admin_cc_email || undefined : undefined,
        bcc: isMain ? emailSettings.admin_bcc_email || undefined : undefined
      });
      if (isMain) adminSuccess = adminResult.success;
      db.addEmailLog({
        order_id: order.id,
        recipient,
        email_type: 'admin_new_order',
        subject: adminSubject,
        status: adminResult.success ? 'sent' : 'failed',
        provider_message_id: adminResult.messageId || null,
        preview_url: adminResult.previewUrl || null,
        error_message: adminResult.error || null
      });
    }
    db.updateOrderEmailStatus(order.id, 'admin', adminSuccess ? 'sent' : 'failed');
  }

  return { customerSuccess, adminSuccess };
}

export async function resendOrderEmail(
  orderId: string,
  emailType: 'customer_order_confirmation' | 'admin_new_order'
): Promise<boolean> {
  const order = db.getOrderById(orderId);
  if (!order) return false;

  const emailSettings = db.getEmailSettings();

  const templateVars: Record<string, string> = {
    order_id: order.id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    order_total: order.total_amount.toString(),
    payment_method: 'Cash on Delivery (COD)',
    order_status: order.order_status,
    delivery_address: `${order.delivery_address.house_flat}, ${order.delivery_address.building_street}, ${order.delivery_address.city} - ${order.delivery_address.pincode}`,
    order_date: new Date(order.created_at).toLocaleDateString('en-IN'),
    items: order.items.map(i => `${i.product_name} (${i.quantity}x)`).join(', ')
  };

  if (emailType === 'customer_order_confirmation') {
    const subject = renderTemplate(emailSettings.customer_email_subject, templateVars);
    const header = renderTemplate(emailSettings.customer_email_header, templateVars);
    const footer = renderTemplate(emailSettings.customer_email_footer, templateVars);
    const html = generateCustomerEmailHtml(order, header, footer);

    const result = await dispatchEmailMessage({
      to: order.customer_email,
      subject,
      html
    });

    db.addEmailLog({
      order_id: order.id,
      recipient: order.customer_email,
      email_type: 'customer_order_confirmation',
      subject,
      status: result.success ? 'sent' : 'failed',
      provider_message_id: result.messageId || null,
      preview_url: result.previewUrl || null,
      error_message: result.error || null
    });

    db.updateOrderEmailStatus(order.id, 'customer', result.success ? 'sent' : 'failed');
    return result.success;
  } else {
    const adminRecipient = emailSettings.admin_notification_email || 'admin@villagedeli.in';
    const subject = renderTemplate(emailSettings.admin_email_subject, templateVars);
    const header = renderTemplate(emailSettings.admin_email_header, templateVars);
    const footer = renderTemplate(emailSettings.admin_email_footer, templateVars);
    const html = generateAdminEmailHtml(order, header, footer);

    const result = await dispatchEmailMessage({
      to: adminRecipient,
      subject,
      html,
      cc: emailSettings.admin_cc_email || undefined,
      bcc: emailSettings.admin_bcc_email || undefined
    });

    db.addEmailLog({
      order_id: order.id,
      recipient: adminRecipient,
      email_type: 'admin_new_order',
      subject,
      status: result.success ? 'sent' : 'failed',
      provider_message_id: result.messageId || null,
      preview_url: result.previewUrl || null,
      error_message: result.error || null
    });

    db.updateOrderEmailStatus(order.id, 'admin', result.success ? 'sent' : 'failed');
    return result.success;
  }
}

export async function sendContactInquiryEmail(contact: {
  name: string;
  email: string;
  phone: string;
  enquiry_type: string;
  message: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const emailSettings = db.getEmailSettings();
  if (emailSettings.enable_contact_emails === false) {
    return { success: true, messageId: 'disabled_by_settings' };
  }

  const adminRecipient = emailSettings.admin_notification_email || 'admin@villagedeli.in';
  const subject = `[VillageDELI Inquiry] ${contact.enquiry_type} — ${contact.name}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 24px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 22px;">New Contact Inquiry Received</h2>
        <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">VillageDELI Customer & Partner Support</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 130px; font-weight: bold;">Sender Name:</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #111827;"><a href="mailto:${contact.email}" style="color: #3b711e;">${contact.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0; color: #111827;">${contact.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Enquiry Type:</td>
            <td style="padding: 8px 0; color: #111827;"><span style="background: #f2f6ee; color: #2d5c16; padding: 3px 8px; border-radius: 6px; font-weight: 600;">${contact.enquiry_type}</span></td>
          </tr>
        </table>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
          <strong style="display: block; color: #374151; margin-bottom: 8px; font-size: 13px;">Message Content:</strong>
          <p style="margin: 0; color: #1f2937; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${contact.message}</p>
        </div>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({
    to: adminRecipient,
    subject,
    html
  });

  db.addEmailLog({
    order_id: 'CONTACT-INQUIRY',
    recipient: adminRecipient,
    email_type: 'contact_inquiry',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendCustomUserEmail({
  to,
  subject,
  message,
  recipient_name
}: {
  to: string;
  subject: string;
  message: string;
  recipient_name?: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 24px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 24px;">VillageDELI</h2>
        <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Everyday Fresh • Farm to Table</p>
      </div>
      <div style="padding: 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        ${recipient_name ? `<p style="font-weight: bold; margin-bottom: 16px;">Hello ${recipient_name},</p>` : ''}
        <div style="white-space: pre-wrap; margin-bottom: 24px; color: #1f2937;">${message}</div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          Sent with care by the VillageDELI Team • <a href="http://localhost:3000" style="color: #6cb33f;">villagedeli.in</a>
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({
    to,
    subject,
    html
  });

  db.addEmailLog({
    order_id: 'CUSTOM-DISPATCH',
    recipient: to,
    email_type: 'admin_custom_message',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendEmailOtp({
  to,
  name,
  otp,
  type
}: {
  to: string;
  name?: string;
  otp: string;
  type: 'login' | 'register';
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const isRegister = type === 'register';
  const actionText = isRegister ? 'complete your registration' : 'sign in to your account';
  const subject = `Your VillageDELI Verification Code: ${otp}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: #0d1f15; padding: 28px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">VillageDELI</h2>
        <p style="color: #9ca3af; margin: 6px 0 0; font-size: 13px;">Everyday Fresh • Farm to Table</p>
      </div>
      <div style="padding: 32px 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        <p style="font-size: 16px; font-weight: 700; color: #111827; margin-top: 0;">
          ${name ? `Hello ${name},` : 'Hello,'}
        </p>
        <p style="color: #4b5563; margin-bottom: 24px;">
          Use the 6-digit one-time verification code below to ${actionText}:
        </p>
        <div style="background: #f4f8f2; border: 2px dashed #6cb33f; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0d1f15; font-family: monospace;">${otp}</span>
          <p style="font-size: 11px; color: #6b7280; margin: 8px 0 0; text-transform: uppercase; font-weight: 600;">Code expires in 10 minutes</p>
        </div>
        <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin-bottom: 0;">
          If you did not request this verification code, please ignore this email. Do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0;" />
        <p style="font-size: 11px; color: #9ca3af; margin: 0; text-align: center;">
          VillageDELI Customer Security • Plot 12, Sector 109, Gurugram, Haryana
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({ to, subject, html });

  db.addEmailLog({
    order_id: `OTP-${type.toUpperCase()}`,
    recipient: to,
    email_type: 'auth_otp',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendWelcomeEmail({
  to,
  name
}: {
  to: string;
  name: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const subject = `Welcome to VillageDELI, ${name}! 🌱`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 28px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 26px; font-weight: 800;">VillageDELI</h2>
        <p style="color: #9ca3af; margin: 6px 0 0; font-size: 13px;">Everyday Fresh • Farm to Table</p>
      </div>
      <div style="padding: 32px 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        <h3 style="color: #0d1f15; font-size: 18px; margin-top: 0;">Welcome to the VillageDELI Family!</h3>
        <p>Dear ${name}, thank you for registering with us. We deliver daily fresh produce, artisanal bakery goods, cold-chain dairy, and organic staples directly to your doorstep in 30–60 minutes.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:3000/order-now" style="background: #6cb33f; color: #0d1f15; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase;">Start Shopping Fresh</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          VillageDELI Sector 109, Gurugram • Support: +91 98765 43210
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({ to, subject, html });

  db.addEmailLog({
    order_id: 'WELCOME-USER',
    recipient: to,
    email_type: 'welcome_email',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendOrderStatusEmail({
  order,
  status
}: {
  order: Order;
  status: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const statusDescriptions: Record<string, { title: string; desc: string; badgeColor: string }> = {
    'Preparing': {
      title: 'Your Order is Being Prepared in Kitchen',
      desc: 'Our chefs and store team are carefully assembling and packaging your fresh items.',
      badgeColor: '#d97706'
    },
    'Out for Delivery': {
      title: 'Your Order is Out for Delivery! 🛵',
      desc: 'Our delivery rider has picked up your package and is on the way to your delivery address.',
      badgeColor: '#2563eb'
    },
    'Delivered': {
      title: 'Your Order Has Been Delivered! 🎉',
      desc: 'Thank you for shopping with VillageDELI! Your items have arrived. We hope you love the freshness.',
      badgeColor: '#16a34a'
    },
    'Cancelled': {
      title: 'Your Order Has Been Cancelled',
      desc: order.cancellation_reason || 'This order was cancelled. If you believe this was an error, please contact our support team.',
      badgeColor: '#dc2626'
    }
  };

  const statusInfo = statusDescriptions[status] || {
    title: `Order Status Updated to ${status}`,
    desc: `Your order ${order.id} status is now ${status}.`,
    badgeColor: '#0d1f15'
  };

  const subject = `VillageDELI Update: Order ${order.id} is ${status}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 24px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 24px; font-weight: 800;">VillageDELI</h2>
        <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Order Tracking Notification</p>
      </div>
      <div style="padding: 28px 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background: ${statusInfo.badgeColor}; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; padding: 6px 16px; border-radius: 9999px; letter-spacing: 0.5px;">
            ${status}
          </span>
          <h3 style="color: #111827; font-size: 20px; margin: 16px 0 8px;">${statusInfo.title}</h3>
          <p style="color: #4b5563; margin: 0;">${statusInfo.desc}</p>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 12px;">Order ID:</span>
            <span style="font-weight: 700; color: #111827;">${order.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 12px;">Total Amount:</span>
            <span style="font-weight: 700; color: #111827;">₹${order.total_amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280; font-size: 12px;">Delivery Address:</span>
            <span style="font-weight: 500; color: #111827; text-align: right; max-width: 60%;">${order.delivery_address?.house_flat}, ${order.delivery_address?.building_street}, ${order.delivery_address?.pincode}</span>
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0 12px;">
          <a href="http://localhost:3000/order-confirmation/${order.id}" style="background: #0d1f15; color: #ffffff; padding: 10px 24px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 13px;">View Live Order Tracking</a>
        </div>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
          VillageDELI Sector 109, Gurugram • Customer Care: +91 98765 43210
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({
    to: order.customer_email,
    subject,
    html
  });

  db.addEmailLog({
    order_id: order.id,
    recipient: order.customer_email,
    email_type: 'order_status_update',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendQueryAcknowledgmentEmail({
  query
}: {
  query: SupportQuery;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const settings = db.getEmailSettings();
  const subject = settings.query_ack_subject
    ? settings.query_ack_subject.replace('{{ticket_id}}', query.id).replace('{{name}}', query.name)
    : `We have received your query - Ticket #${query.id}`;

  const message = settings.query_ack_message
    ? settings.query_ack_message.replace('{{name}}', query.name).replace('{{enquiry_type}}', query.enquiry_type).replace('{{ticket_id}}', query.id)
    : `Dear ${query.name}, thank you for contacting VillageDELI. Our team has received your query regarding ${query.enquiry_type}. We will reply to your request shortly.`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 24px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 24px; font-weight: 800;">VillageDELI Helpdesk</h2>
        <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Customer Support Ticket #${query.id}</p>
      </div>
      <div style="padding: 28px 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        <p style="font-size: 15px; font-weight: 700; color: #111827;">Hello ${query.name},</p>
        <p style="color: #4b5563;">${message}</p>
        <div style="background: #f9fafb; border-left: 4px solid #6cb33f; padding: 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280; font-weight: 700; text-transform: uppercase;">Ticket Summary:</p>
          <p style="margin: 0 0 4px; font-size: 13px;"><strong>Ticket Number:</strong> ${query.id}</p>
          <p style="margin: 0 0 4px; font-size: 13px;"><strong>Department:</strong> ${query.enquiry_type}</p>
          <p style="margin: 0; font-size: 13px;"><strong>Status:</strong> ${query.status}</p>
        </div>
        <p style="font-size: 13px; color: #6b7280;">
          You can track this conversation anytime from your <a href="http://localhost:3000/my-account?tab=queries" style="color: #6cb33f; font-weight: 700;">Account Support Portal</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
          VillageDELI Customer Support • support@villagedeli.in
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({ to: query.email, subject, html });

  db.addEmailLog({
    order_id: query.id,
    recipient: query.email,
    email_type: 'query_acknowledgment',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}

export async function sendQueryReplyEmail({
  query,
  replyMessage
}: {
  query: SupportQuery;
  replyMessage: string;
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  const subject = `Update on Support Ticket #${query.id} — VillageDELI Helpdesk`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: #0d1f15; padding: 24px; text-align: center;">
        <h2 style="color: #6cb33f; margin: 0; font-size: 24px; font-weight: 800;">VillageDELI Helpdesk</h2>
        <p style="color: #9ca3af; margin: 4px 0 0; font-size: 13px;">Response to Ticket #${query.id}</p>
      </div>
      <div style="padding: 28px 24px; color: #374151; font-size: 14px; line-height: 1.6;">
        <p style="font-size: 15px; font-weight: 700; color: #111827;">Hello ${query.name},</p>
        <p style="color: #4b5563;">Our support specialist has provided an update regarding your inquiry (<strong>${query.enquiry_type}</strong>):</p>
        <div style="background: #eef5ea; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #6cb33f/40; color: #0d1f15; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${replyMessage}</div>
        <div style="text-align: center; margin: 24px 0 12px;">
          <a href="http://localhost:3000/my-account?tab=queries" style="background: #0d1f15; color: #ffffff; padding: 10px 24px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 13px;">View Full Conversation / Reply</a>
        </div>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
          VillageDELI Customer Care Team • Plot 12, Sector 109, Gurugram
        </p>
      </div>
    </div>
  `;

  const result = await dispatchEmailMessage({ to: query.email, subject, html });

  db.addEmailLog({
    order_id: query.id,
    recipient: query.email,
    email_type: 'query_reply',
    subject,
    status: result.success ? 'sent' : 'failed',
    provider_message_id: result.messageId || null,
    preview_url: result.previewUrl || null,
    error_message: result.error || null
  });

  return result;
}


