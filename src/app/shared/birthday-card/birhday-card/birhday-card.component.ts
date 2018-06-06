import { Component, OnInit, Input } from '@angular/core';

import { Evento } from './../../../interfaces/evento';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-birhday-card',
  templateUrl: './birhday-card.component.html',
  styleUrls: ['./birhday-card.component.scss']
})
export class BirhdayCardComponent implements OnInit {
  public todaysBirthday = false;
  public descriptionColor;
  private colors = [
    '#7dc741',
    '#fbaa20',
    '#5dc7b6',
    '#f76971',
    '#CDDC39',
    '#9C27B0',
    '#607D8B'
  ];
  @Input() birthdayData: Evento;

  constructor(private util: UtilsService) { }

  ngOnInit() {
    this.descriptionColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    if (this.util.isTodayBirthday(this.birthdayData)) {
      this.todaysBirthday = true;
    }
  }

}
