import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { MeetingType } from 'src/constants/meeting.type';
import { MailTemplate } from 'src/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from 'src/mail-templates/mail-templates.service';
import { CreateMeetingDto } from 'src/meetings/dto/create-meeting.dto';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { sendEmailDto } from 'src/sent-emails/dto/send-email.dto';
import { Repository } from 'typeorm';

// ! GOOGLE IMPORTS
const path = require("path");
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

let CALENDAR_RDV_ID = "";
let CALENDAR_TABLE_ID = "";
let oauth2Client!: OAuth2Client;

@Injectable()
export class GoogleService {

  constructor(
    @InjectRepository(ProjectManager)
    private readonly pmRepository: Repository<ProjectManager>,

    private readonly mailTemplatesService: MailTemplatesService
  ) {

    const credentials = require(path.join(process.cwd(), process.env.CREDENTIALS_PATH))
    oauth2Client = new google.auth.OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris
    );
    CALENDAR_RDV_ID = process.env.CALENDAR_RDV_ID;
    CALENDAR_TABLE_ID = process.env.CALENDAR_TABLE_ID;
  }

  // ! ---------------------------- Google Authentication Methods ----------------------------
   auth() {
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: 'consent'
      });
      return {url: url}
    } catch (error) {
      console.log(error)
      throw new HttpException("Authentication failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async retrieveTokens(code: string, pm: ProjectManager) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      if(pm.tokenGoogle == '') {
        await this.pmRepository.update(pm.id, { tokenGoogle: JSON.stringify(tokens)})
      } else if (!tokens.refresh_token && JSON.parse(pm.tokenGoogle).refresh_token) {
        await this.pmRepository.update(pm.id, { tokenGoogle: JSON.stringify({ refresh_token: JSON.parse(pm.tokenGoogle).refresh_token, ...tokens})})
      } else {
        await this.pmRepository.update(pm.id, { tokenGoogle: JSON.stringify(tokens)})
      }
      return true;
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de récupérer les tokens", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  } 


  // ! ---------------------------- Google Authentication Methods END ----------------------------


  // ! ---------------------------- LOGOUT START ----------------------------

  async logout(user: ProjectManager) {
    try {
      if(user.tokenGoogle == '') {
        return 1
      } else {
        await this.pmRepository.update(user.id, { tokenGoogle: '' })
        return 0;
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
      return user.tokenGoogle != '';
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de vérifier si l'utilisateur est authentififé avec Google", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // ! ---------------------------- CHECK IF USER IS GOOGLE LOGGED ----------------------------


  prepareGoogleAPICall(pm: ProjectManager) {
    try {
      console.log(pm)
      if(pm.tokenGoogle == '') {
        
        return false
      } else {
        oauth2Client.setCredentials(JSON.parse(pm.tokenGoogle))
        return true
      }
    } catch (error) {
      console.log(error)
    }
  }
  // ! ------------------------------------------------------------------------------------ METHODS ------------------------------------------------------------------------------------

  // ? Create an event on calendar JISEP -> for meetings
  async createEventOnCalendar(createMeetingDto: CreateMeetingDto, pm: ProjectManager) {
    try {
      if(!this.prepareGoogleAPICall(pm)) {
        console.log("false")
        return false
      } else {
        console.log("still")
        const calendar = google.calendar({ version: 'v3' });
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
          access_token: JSON.parse(pm.tokenGoogle).access_token,
          refresh_token: JSON.parse(pm.tokenGoogle).refresh_token,
          conferenceDataVersion: createMeetingDto.type == MeetingType.TEL_VISIO ? 1 : 0
        })
      }
      
    } catch (error) {
      console.error(error)
      throw new HttpException("Impossible de créer un évènement sur le calendrier", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  // ? send mail to client, with template from JISEP AND PM
  async sendMail(sendEmailDto: sendEmailDto, mailTemplate: MailTemplate, pm: ProjectManager) {
    try {
      // ? content of the mail to send
      const mailContent = await this.mailTemplatesService.generateMailContent(pm, sendEmailDto, mailTemplate)

      // ? sending the mail with Gmail API
      const gmail = google.gmail({version: 'v1'})
      
      // * pièces jointes (plaquette)
      const fileAttachments = [
        {
          filename: "Plaquette Junior ISEP.pdf",
          path: "src/templates/plaquette.pdf",
        }
      ]

      // * options for the mail
      const options = {
        to: sendEmailDto.prospect.email.email,
        replyTo: pm.mail,
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
        access_token: JSON.parse(pm.tokenGoogle).access_token,
        refresh_token: JSON.parse(pm.tokenGoogle).refresh_token,
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
