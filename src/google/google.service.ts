import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MeetingType } from 'src/constants/meeting.type';
import { CreateMeetingDto } from 'src/meetings/dto/create-meeting.dto';
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];
let CREDENTIALS_PATH = "";
let CALENDAR_RDV_ID = "";
let CALENDAR_TABLE_ID = "";
@Injectable()
export class GoogleService {

  constructor() {

    if (process.env.BASE_URL.includes("localhost")) {
      // ! LOCALHOST / DEV
      CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.dev.json');

      // ? Calendrier '[Brouillon] Organisation'
      CALENDAR_RDV_ID = "c_ibijclono1jjm07up41ob2t6b8@group.calendar.google.com"

      // ? Calendrier 'Test prospectix'
      CALENDAR_TABLE_ID = "c_ec0400266ff405da7c7d561e44505039ef85262f679bebe499167566a9480072@group.calendar.google.com"
    } else if (process.env.BASE_URL.includes("staging")) {
      // ! STAGING
      CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.staging.json');

      // ? Calendrier '[Brouillon] Organisation'
      CALENDAR_RDV_ID = "c_ibijclono1jjm07up41ob2t6b8@group.calendar.google.com"

      // ? Calendrier 'Test prospectix'
      CALENDAR_TABLE_ID = "c_ec0400266ff405da7c7d561e44505039ef85262f679bebe499167566a9480072@group.calendar.google.com"
    } else {
      // ! PRODUCTION
      CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.prod.json');

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
  async loadSavedCredentialsIfExist() {
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
  async saveCredentials(client) {
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
  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }


  // ! ---------------------------- Google Authentication Methods END ----------------------------


  // ! ---------------------------- LOGOUT START ----------------------------

  async logout() {
    try {
      try {
        await fs.readFile(TOKEN_PATH)
        await fs.unlink(TOKEN_PATH)
        return "Logged out"
      } catch (error) {
        return "Already logged out"
      }
    } catch (error) {
      console.log(error)
      throw new HttpException("Impossible de se déconnecter", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // ! ---------------------------- LOGOUT END ----------------------------



  // ! ------------------------------------------------------------------------------------ METHODS ------------------------------------------------------------------------------------

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

}
