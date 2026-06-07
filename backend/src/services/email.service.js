import { resend } from "../config/resend.js";

function formatBody(body) {
  return body
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin: 0 0 14px;">${line}</p>`)
    .join("");
}

export async function sendMatchEmail({ to, subject, body }) {
  const logoUrl = process.env.COMPANY_LOGO_URL;

  const html = `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background:#f6f2ee; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ee; padding:32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="padding:28px 32px; text-align:center; background:#fff7f2;">
                  ${
                    logoUrl
                      ? `<img src="${logoUrl}" alt="The Date Crew" width="120" style="display:block; margin:0 auto 14px;" />`
                      : `<div style="font-size:22px; font-weight:700; color:#7c2d12;">The Date Crew</div>`
                  }
                  <div style="font-size:13px; color:#9a6b55; letter-spacing:0.4px;">
                    Thoughtful introductions for serious relationships
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:34px 38px 20px;">
                  <h1 style="margin:0 0 18px; color:#2f1b14; font-size:24px; line-height:1.3;">
                    A thoughtful match curated for you
                  </h1>

                  <div style="font-size:15px; line-height:1.7; color:#4b3a34;">
                    ${formatBody(body)}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 38px 32px;">
                  <div style="background:#fff7f2; border:1px solid #f0d8cc; border-radius:14px; padding:18px;">
                    <p style="margin:0; color:#7c2d12; font-size:14px; line-height:1.6;">
                      This introduction was curated by your TDC matchmaker based on compatibility signals, preferences, and relationship goals.
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 32px; text-align:center; background:#2f1b14;">
                  <p style="margin:0; color:#f8e7dc; font-size:13px;">
                    © The Date Crew
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.TEST_EMAIL,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}