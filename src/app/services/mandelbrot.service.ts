import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {

  constructor() { }

  async workerTest(){
    debugger
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../webworkers/mandelbrot.worker', import.meta.url),
        {type: 'module'});

      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };

      worker.postMessage('hello');
    }
  }

  getManderbrotSection(canvas: any, width: number, height: number){
    canvas.lineTo(150, 25);
    canvas.arc(100,75,50,0,2*Math.PI);
    canvas.stroke();
  }
}
