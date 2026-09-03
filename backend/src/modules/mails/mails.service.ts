import { Injectable, Inject } from '@nestjs/common';
import { Services } from 'src/common/utils/constants';
import { IMailerService } from '../mailer/mailer';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { IMailsService } from './mails';
import { MailData } from './types/mails.type';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailsService implements IMailsService {
  constructor(
    @Inject(Services.MAILER) private readonly mailerService: IMailerService,

    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private resolveTemplatePath(fileName: string): string {
    const templateCandidates = [
      path.join(
        process.cwd(),
        'src',
        'modules',
        'mails',
        'templates',
        fileName,
      ),
      path.join(__dirname, 'templates', fileName),
      path.join(__dirname, '..', 'mails', 'templates', fileName),
    ];

    const existingTemplatePath = templateCandidates.find((templatePath) =>
      fs.existsSync(templatePath),
    );

    return existingTemplatePath ?? templateCandidates[0];
  }

  async confirmRegisterUser(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Email Confirmation',
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/confirm-email/${mailData.data.hash}`,
      templatePath: this.resolveTemplatePath('confirm.hbs'),
      context: {
        username: mailData.data.user,
        confirmationLink: `${this.configService.get<string>(
          'app.frontendDomain',
          {
            infer: true,
          },
        )}/confirm-email/${mailData.data.hash}`,
      },
    });
  }

  async forgotPassword(
    mailData: MailData<{ hash: string; user: string }>,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Password Reset',
      text: `${this.configService.get<string>('app.frontendDomain', {
        infer: true,
      })}/reset-password?hash=${mailData.data.hash}`,
      templatePath: this.resolveTemplatePath('reset-password.hbs'),
      context: {
        username: mailData.data.user,
        resetLink: `${this.configService.get<string>('app.frontendDomain', {
          infer: true,
        })}/reset-password?hash=${mailData.data.hash}`,
      },
    });
  }
}
