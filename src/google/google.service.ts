import { Injectable } from '@nestjs/common';
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { calendar } from 'googleapis/build/src/apis/calendar';
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

@Injectable()
export class GoogleService {

  async test() {

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
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
    async function saveCredentials(client) {
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
    async function authorize() {
      let client = await loadSavedCredentialsIfExist();
      if (client) {
        return client;
      }
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      if (client.credentials) {
        await saveCredentials(client);
      }
      return client;
    }

    /**
     * Lists the next 10 events on the user's primary calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    async function listEvents(auth) {
      const calendar = google.calendar({ version: 'v3', auth });
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      const events = res.data.items;
      if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
      }
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    }

    async function insertEvent () {

      var event = {
        'summary': 'Google I/O 2015',
        'location': '22 rue Notre Dame des Champs, 75014 Paris',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2022-12-15T19:00:00-00:00',
          'timeZone': 'Europe/Paris',
        },
        'end': {
          'dateTime': '2022-12-15T21:00:00-00:00',
          'timeZone': 'Europe/Paris',
        }
      };
  
      const calendar = google.calendar({version: 'v3', auth});
      return await calendar.events.insert({
        // auth: auth,
        calendarId: 'c_ibijclono1jjm07up41ob2t6b8@group.calendar.google.com',
        resource: event,
      }, function (err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', event.htmlLink);
      });
    }

    // authorize().then(listEvents).catch(console.error);
    return authorize().then(insertEvent).catch(console.error)
  }

  async addEvent() {
    // Refer to the Node.js quickstart on how to setup the environment:
    // https://developers.google.com/calendar/quickstart/node
    // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
    // stored credentials.


  }
}
