import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GifsService {
  // 'random?api_key=Jxk0xJH6QxhBQ2EdrqmOivy3TpSVrx4S&tag=';

  constructor(private httpClient: HttpClient) { }

  getGif(query: string): Observable<any> {
    query = query.trim();
    if (!query || query.length <= 0) {
      return;
    }
    const offSet = Math.floor(Math.random() * 25);
    const GIPHY_ENDPOINT = `//api.giphy.com/v1/gifs/search?
    q=${query}&limit=1&rating=pg&offset=${offSet}&api_key=Jxk0xJH6QxhBQ2EdrqmOivy3TpSVrx4S&tag`;

    return this.httpClient.get<any>(GIPHY_ENDPOINT);
  }
}
