import { SendMailOptions } from 'nodemailer';

export interface IMailerService {
  sendMail({
    templatePath,
    context,
    ...mailOptions
  }: SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void>;
}
