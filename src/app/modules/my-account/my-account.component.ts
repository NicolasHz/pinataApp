import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, HostListener } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  public scrolled;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private util: UtilsService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = this.util.scrolled(this.doc);
  }

}
