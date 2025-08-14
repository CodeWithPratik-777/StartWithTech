const nodemailer = require('nodemailer');

const sendSubscribeVerifyEmail = async ({ email, token, baseUrl }) => {
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

  const action_url = `${baseUrl}/api/subscribe/verify?token=${token}&email=${email}`;

  const mailOptions = {
    from: '"StartWithTech" <no-reply@startwithtech.com>',
    to: email,
    subject: 'Confirm your subscription',
    html: `
      <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; background-color: #F5F7F9; margin: 0; padding: 0; color: #839197;">
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
                          <h1 style="color: #292E31; font-size: 20px;">Verify your email address</h1>
                          <p style="font-size: 16px; color: #333;">Thanks for subscribing to StartWithTech! Click the button below to verify your email address.</p>

                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${action_url}" 
                              style="display: inline-block; background-color: #fa5005; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold;">
                              Verify Email
                            </a>
                          </div>

                          <p style="font-size: 14px; color: #666;">
                            If you're having trouble clicking the button, copy and paste the URL below into your web browser:
                          </p>
                          <p style="font-size: 14px; color: #414EF9; word-break: break-all;">
                            <a href="${action_url}" style="color: #414EF9;">${action_url}</a>
                          </p>

                          <p style="font-size: 14px; color: #666;">If you didn’t request this, you can safely ignore this email.</p>
                          <p style="font-size: 13px; margin-top: 20px;">Note: This link will expire in 15 minutes.</p>
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

module.exports = sendSubscribeVerifyEmail;
