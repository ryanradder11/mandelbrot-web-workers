import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {
   maxIterations = 150;
   mandelMin = -2.5;
   mandelMax = 2.5;
   infinity = 40;
   pixelSize = 1
   brightness = 0;
   width = 700;
   height = 700;

  constructor() { }


  drawManderbrot(ctx: CanvasRenderingContext2D, ){

    const mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

    for (let y = 0; y < this.height; y++) {

      let x;
      for (x = 0; x < this.width; x++) {

        let a = mapValue(y, 0, this.height, this.mandelMin, this.mandelMax);
        let b = mapValue(x, 0, this.width, this.mandelMin, this.mandelMax);

        let initialA = a;
        let initialB = b;

        let iterationCount = 0;

        while (iterationCount < this.maxIterations) {

          //Echt component
          let aa = (a * a) - (b * b);

          //Denkbeeldig component
          let bb = (2 * a * b);

          //De initiele waarde is c
          a = aa + initialA;
          b = bb + initialB;

          //We willen de absolute waarde
          let result = Math.abs(a + b);

          //Is het oneindig?
          if (result >= this.infinity) {

            //Niet in de set
            this.brightness = (iterationCount * 4 ) % 255;
            ctx.fillStyle = 'rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')';
            break;

          } else {

            //Wel in de set
            this.brightness = mapValue(iterationCount, 0, this.maxIterations, 255, 0);
            ctx.fillStyle = 'rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')';
          }

          iterationCount++;
        }
        ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
      }
      ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
    }


  }




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
}
