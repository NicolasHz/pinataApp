import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {
  public confettis: any[] = [];
  @Input() size = 50;
  constructor() { }

  ngOnInit() {
    for (let i = 0; i <= this.size; i++) {
      this.confettis.push({
        animationDelay: ((Math.random() * 10) - 5).toFixed(2) + 's',
        left: (i * this.confettis.length / i + 5) + '%',
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
