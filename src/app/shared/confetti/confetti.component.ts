import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {
  public confettis: any[] = [];
  @Input() size = 120;
  constructor() { }

  ngOnInit() {
    for (let i = 0; i <= this.size; i++) {
        this.confettis.push({
        animationDelay: ((Math.random() * 10) - 5).toFixed(2) + 's',
        left: (i / this.size) * 100 + '%',
        backgroundColor: this.getRandomColor(),
        width: this.getRandomShape(i).width + 'px',
        height: this.getRandomShape(i).heigth + 'px',
        borderRadius: this.getRandomShape(i).borderRadius + '%'
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
  getRandomShape(i: number) {
    const shape = {width: 15, heigth: 15, borderRadius: 0};
    const isEven = n => {
      return n % 2 === 0;
    };
    shape.width = Math.floor(Math.random() * 15) + 8;
    shape.heigth = Math.floor(Math.random() * 15) + 8;
    if (isEven(i)) {
      shape.borderRadius = Math.floor(Math.random() * 100) + 0;
    }
    console.log(shape)
    return shape;
  }
}
