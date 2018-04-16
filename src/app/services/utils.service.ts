import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  scrolled(doc: Document) {
    const isChrome = navigator.userAgent.indexOf('Chrome/') > -1;
    const isExplorer = navigator.userAgent.indexOf('Trident/') > -1;
    const bodyTop = doc.body.scrollTop;
    const toTop = doc.documentElement.scrollTop;

    if (isChrome || isExplorer) {
     if (toTop > 50) {
      return true;
     } else if (this.scrolled && toTop < 5) {
      return false;
     }
    } else {
     if ( bodyTop > 50 ) {
      return true;
     }else if (this.scrolled && bodyTop < 5) {
      return false;
    }
   }
  }
}
