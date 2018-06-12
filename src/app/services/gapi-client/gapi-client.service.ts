import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var gapi: any;

@Injectable()
export class GapiClientService {
  private API_KEY = 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ';
  private CLIENT_ID = '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private SCOPE = 'https://www.googleapis.com/auth/calendar';
  public calendarApiClient;
  constructor() {
    gapi.load('client:auth2', this.initClient);
  }

  // Calendar interaction
  initClient = () => {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPE
    }).then(() => {
      this.calendarApiClient = gapi.auth2.getAuthInstance();
      this.getEventsFromCalendar();
    })
      .catch(() => console.log('Something Wrong with calendar Api'));
  }

  getEventsFromCalendar(): Promise<any> {
    return this.calendarApiClient.then(() => {
     return gapi.client.calendar.events.list({
       calendarId: 'primary',
       timeMin: (new Date(new Date().setMonth(new Date().getMonth() - 2))).toISOString(),
       showDeleted: false,
       singleEvents: true,
       maxResults: 300,
       orderBy: 'startTime'
     }).then(response => {
       if (!response) {
         return;
       }
       console.log(response.result.items)
       return response.result.items;
     }).catch(() => console.log('something wrong at fetching events from calendar'));
   });
  }

  getCalendarApi(): Promise<any> {
    return this.calendarApiClient;
  }
}
