import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {

  constructor() { }

  getManderbrotSection(canvas: any, width: number, height: number){
    canvas.lineTo(150, 25);
    canvas.arc(100,75,50,0,2*Math.PI);
    canvas.stroke();
  }
}
