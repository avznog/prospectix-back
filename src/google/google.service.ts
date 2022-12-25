import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MeetingType } from 'src/constants/meeting.type';
import { MailTemplate } from 'src/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from 'src/mail-templates/mail-templates.service';
import { CreateMeetingDto } from 'src/meetings/dto/create-meeting.dto';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { sendEmailDto } from 'src/sent-emails/dto/send-email.dto';

// ! GOOGLE IMPORTS
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// ! Mail Import
const MailComposer = require('nodemailer/lib/mail-composer');

// ! GOOGLE IMPORTANT VARIABLES
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];
let CREDENTIALS_PATH = "";
let CALENDAR_RDV_ID = "";
let CALENDAR_TABLE_ID = "";
let PROSPECTIX_MAIL = "prospectix@juniorisep.com";

let ENVIRONMENT = "dev";
@Injectable()
export class GoogleService {

  constructor(
    private readonly mailTemplatesService: MailTemplatesService
  ) {
    if (process.env.BASE_URL.includes("localhost")) {
      ENVIRONMENT = "dev";
      // ! LOCALHOST / DEV
      CREDENTIALS_PATH = path.join(process.cwd(), '/src/google/credentials/' + 'credentials.dev.json');

      // ? Calendrier '[Brouillon] Organisation'
      CALENDAR_RDV_ID = "c_ibijclono1jjm07up41ob2t6b8@group.calendar.google.com"

      // ? Calendrier 'Test prospectix'
      CALENDAR_TABLE_ID = "c_ec0400266ff405da7c7d561e44505039ef85262f679bebe499167566a9480072@group.calendar.google.com"
    } else if (process.env.BASE_URL.includes("staging")) {
      ENVIRONMENT = "staging";
      // ! STAGING
      CREDENTIALS_PATH = path.join(process.cwd(), '/src/google/credentials/' + 'credentials.staging.json');

      // ? Calendrier '[Brouillon] Organisation'
      CALENDAR_RDV_ID = "c_ibijclono1jjm07up41ob2t6b8@group.calendar.google.com"

      // ? Calendrier 'Test prospectix'
      CALENDAR_TABLE_ID = "c_ec0400266ff405da7c7d561e44505039ef85262f679bebe499167566a9480072@group.calendar.google.com"
    } else {
      ENVIRONMENT = "prod";
      // ! PRODUCTION
      CREDENTIALS_PATH = path.join(process.cwd(), '/src/google/credentials/' + 'credentials.prod.json');

      // ? Calendrier 'RDV'
      CALENDAR_RDV_ID = "juniorisep.com_pjiviq7iqt5ahefn4jg55ql8ec@group.calendar.google.com"

      // ? Calendrier 'Table de Réunion'
      CALENDAR_TABLE_ID = "juniorisep.com_cgoeun5k5ipq6idaq2kbf10r18@group.calendar.google.com"
    }
  }

  // ! ---------------------------- Google Authentication Methods ----------------------------

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist(TOKEN_PATH: string) {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(TOKEN_PATH: string, client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize(user: ProjectManager) {
    const TOKEN_PATH = path.join(process.cwd(), '/src/google/tokens/token_' + user.pseudo + '.json');
    let client = await this.loadSavedCredentialsIfExist(TOKEN_PATH);
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(TOKEN_PATH, client);
    }
    return client;
  }


  // ! ---------------------------- Google Authentication Methods END ----------------------------


  // ! ---------------------------- LOGOUT START ----------------------------

  async logout(user: ProjectManager) {
    try {
      try {
        const TOKEN_PATH = path.join(process.cwd(), '/src/google/tokens/token_' + user.pseudo + '.json');
        await fs.readFile(TOKEN_PATH)
        await fs.unlink(TOKEN_PATH)
        return 0 // ? 0 for logged out
      } catch (error) {
        return 1 // ? 1 for already logged out
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de se déconnecter", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // ! ---------------------------- LOGOUT END ----------------------------

  // ! ---------------------------- CHECK IF USER IS GOOGLE LOGGED ----------------------------

  async checkLogged(user: ProjectManager) : Promise<boolean> {
    try {
      const TOKEN_PATH = path.join(process.cwd(), '/src/google/tokens/token_' + user.pseudo + '.json');
      try {
        await fs.readFile(TOKEN_PATH)
        return true
      } catch (error) {
        return false
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de vérifier si l'utilisateur est authentififé avec Google", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ! ---------------------------- CHECK IF USER IS GOOGLE LOGGED ----------------------------


  // ! ------------------------------------------------------------------------------------ METHODS ------------------------------------------------------------------------------------

  // ? Create an event on calendar JISEP -> for meetings
  async createEventOnCalendar(createMeetingDto: CreateMeetingDto, auth?) {
    try {
      const calendar = google.calendar({ version: 'v3', auth });
      var event = {
        summary: `[${createMeetingDto.prospect.companyName}] - ${createMeetingDto.pm.firstname.charAt(0).toUpperCase() + createMeetingDto.pm.firstname.slice(1).toLowerCase()} ${createMeetingDto.pm.name.toUpperCase()}`, // ? Nom de l'évènement
        location: createMeetingDto.prospect.streetAddress != '' && `${createMeetingDto.prospect.streetAddress}, ${createMeetingDto.prospect.city.zipcode} ${createMeetingDto.prospect.city.name}, ${createMeetingDto.prospect.country.name}`, // ? Lieu de l'évènement -> adresse du prospect
        start: {
          dateTime: `${new Date(createMeetingDto.date).toISOString()}`, // ? Heure de début du rendez-vous
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: `${new Date(new Date(createMeetingDto.date).setHours(new Date(createMeetingDto.date).getHours() + 1)).toISOString()}`, // ? Heure de fin du rendez-vous
          timeZone: 'Europe/Paris',
        },
        attendees: [ // ? Invités
          { email: `${createMeetingDto.pm.mail}`, 'responseStatus': 'accepted' }, // ? email du chef de projet
          createMeetingDto.prospect.email.email && createMeetingDto.prospect.email.email != '' && { 'email': `${createMeetingDto.prospect.email.email}` } // ? email du client
        ],
        conferenceData: {
          createRequest: {
            requestId: `${createMeetingDto.pm.pseudo.slice(3) + createMeetingDto.prospect.companyName.slice(3)}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            }
          }
        }
      };
      return await calendar.events.insert({
        calendarId: createMeetingDto.type == MeetingType.MEETING_TABLE ? CALENDAR_TABLE_ID : CALENDAR_RDV_ID,
        resource: event,
        sendUpdates: 'all',
        conferenceDataVersion: createMeetingDto.type == MeetingType.TEL_VISIO ? 1 : 0
      })
    } catch (error) {
      console.error(error)
      throw new HttpException("Impossible de créer un évènement sur le calendrier", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  // ? send mail to client, with template from JISEP AND PM
  async sendMail(sendEmailDto: sendEmailDto, mailTemplate: MailTemplate, pm: ProjectManager, auth?) {
    try {
      // ? content of the mail to send
      const mailContent = await this.mailTemplatesService.generateMailContent(pm, sendEmailDto, mailTemplate)

      // ? sending the mail with Gmail API
      const gmail = google.gmail({version: 'v1', auth})
      
      // * pièces jointes (plaquette)
      const fileAttachments = [
        {
          filename: "Plaquette Junior ISEP.pdf",
          path: "src/mail-templates/templates/plaquette.pdf",
        }
      ]

      // * options for the mail
      const options = {
        to: ENVIRONMENT == 'dev' ? PROSPECTIX_MAIL : sendEmailDto.prospect.email.email,
        replyTo: ENVIRONMENT == 'dev' ? PROSPECTIX_MAIL : pm.mail,
        subject: sendEmailDto.object,
        html: mailContent.toString(),
        textEncoding: 'base64',
        labels: ["INBOX", "STARRED", "IMPORTANT"],
        attachments: sendEmailDto.withPlaquette && fileAttachments,
        headers: [
          {
            name: "Content-Type",
            value: "application/json"
          }
        ]
      };

      return await gmail.users.messages.send({
        userId: 'me',
        labelIds: ["INBOX", "STARRED", "IMPORTANT"],
        resource: {
          raw: Buffer.from(await new MailComposer(options).compile().build()).toString("base64")
        }
      });
    } catch (error) {
      console.error(error)
      throw new HttpException("Impossible d'envoyer le mail avec l'API Gmail de Google", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
