import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable()
export class GapiClientService {
  private API_KEY = 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ';
  private CLIENT_ID = '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private SCOPE = 'https://www.googleapis.com/auth/calendar';
  public calendarApiClient;
  constructor() { }

  initGAPIAuth() {
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
    })
      .catch(() => console.log('Something Wrong with calendar Api'));
  }

  getCalendarApi(): Promise<any> {
    return this.calendarApiClient;
  }
}
