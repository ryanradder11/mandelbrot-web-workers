import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {

  constructor() { }

  async workerTest(i: string){
    debugger
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../webworkers/mandelbrot.worker', import.meta.url),
        {type: 'module'});

      worker.onmessage = ({data}) => {
        debugger
        console.log(`page got message: ${data}`);
      };

      worker.postMessage('worker' + i + 'finished computation');
    }
  }

  getManderbrotSection(ctx: CanvasRenderingContext2D, width: number, height: number){
    ctx.lineTo(150, 25);
    ctx.arc(100,75,50,0,2*Math.PI);
    ctx.stroke();
  }
}
