import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';

let transporter;

function createTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: getEnvVariable('SMTP_HOST'),
      port: Number(getEnvVariable('SMTP_PORT')),
      secure: getEnvVariable('SMTP_PORT') === '465',
      auth: {
        user: getEnvVariable('SMTP_LOGIN'),
        pass: getEnvVariable('SMTP_PASSWORD'),
      },
      logger: true,
      debug: true,
    });
  }
  return transporter;
}

export async function sendMail(mail) {
  mail.from = getEnvVariable('SMTP_FROM');
  try {
    const transporterInstance = createTransporter();
    const info = await transporterInstance.sendMail(mail);
    console.log('Email sent:', info);
    return info;
  } catch (err) {
    console.error('Email error:', err);
    throw err;
  }
}
