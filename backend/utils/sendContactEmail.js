const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.ADMIN_EMAIL,
    subject: subject || 'New Contact Message',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #F5F7F9; padding: 0; margin: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F9;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 25px 0;">
                    <h2 style="color: #fa5005; margin: 0;">StartWithTech</h2>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #ffffff; border-top: 1px solid #E7EAEC; border-bottom: 1px solid #E7EAEC;">
                    <table align="center" width="570" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 35px;">
                          <h1 style="color: #292E31; font-size: 20px; margin-bottom: 10px;">New Contact Message</h1>
                          <p style="font-size: 16px; color: #333;"><strong>Name:</strong> ${name}</p>
                          <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${email}</p>
                          <p style="font-size: 16px; color: #333;"><strong>Subject:</strong> ${subject || '(No Subject)'}</p>
                          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                          <p style="font-size: 16px; color: #333;"><strong>Message:</strong></p>
                          <p style="font-size: 15px; color: #555; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} StartWithTech. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;
