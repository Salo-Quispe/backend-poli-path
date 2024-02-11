import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../app/user/entities/user.entity';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly appUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl =
      this.configService.get<string>('APP_URL') +
        '/' +
        this.configService.get<string>('APP_API_PREFIX') +
        '/' +
        this.configService.get<string>('APP_API_VERSION') ||
      'http://localhost:3000/api/v1';
    console.log(this.appUrl);
  }

  private async getAccessToken() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get('REFRESH_TOKEN'),
    });

    const newAccessToken = await oauth2Client.getAccessToken();
    return newAccessToken.res.data.access_token;
  }

  private async setTransport() {
    try {
      const accessToken = await this.getAccessToken();

      const config: Options = {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get('EMAIL'),
          clientId: this.configService.get('CLIENT_ID'),
          clientSecret: this.configService.get('CLIENT_SECRET'),
          accessToken: accessToken,
        },
        name: 'gmail',
        socketTimeout: 30000,
        dnsTimeout: 30000,
        connectionTimeout: 30000,
        secure: true,
        logger: true,
      };

      this.mailerService.addTransporter('gmail', config);
    } catch (error) {
      console.error(error);
      throw new Error('Error al configurar el servicio de correo');
    }
  }

  async sendEmailConfirmation(user: User, token: string) {
    try {
      await this.setTransport();

      const url = `${this.appUrl}/auth/confirm-email/${token}`;
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: user.email,
        from: 'poli.path.epn@gmail.com',
        subject: 'Bienvenido a la PoliPath!, confirma tu cuenta',
        template: './confirmation',
        context: {
          name: `${user.name} ${user.lastname}`,
          url,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error al enviar el correo');
    }
  }

  async sendEmailForRecoverPassword(user: User, token: string) {
    await this.setTransport();

    const url = `${this.appUrl}/auth/confirm-token?token=${token}`;
    await this.mailerService.sendMail({
      transporterName: 'gmail',
      to: user.email,
      from: 'poli.path.epn@gmail.com',
      subject: 'Recuperación de contraseña',
      template: './recover-password',
      context: {
        name: `${user.name} ${user.lastname}`,
        url,
      },
    });
  }
}
