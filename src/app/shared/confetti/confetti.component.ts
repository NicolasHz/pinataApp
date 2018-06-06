import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {
  public confettis: Array<any> = [];
  constructor() { }

  ngOnInit() {
    for (let i = 0; i <= 100; i++) {
      this.confettis.push({
        animationDelay: ((Math.random() * 10) - 5).toFixed(2) + 's',
        left: (i * this.confettis.length / i) + '%',
        backgroundColor: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
