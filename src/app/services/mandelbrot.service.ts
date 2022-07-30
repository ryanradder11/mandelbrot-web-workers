import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {
   maxIterations = 100;
   public mandelMin = -1;
   public mandelMax = 1;
   infinity = 40;
   pixelSize = 1
   brightness = 0;
   width = 700;
   height = 700;
   zoomModifier = 0.10;

  constructor() { }

  changeMandelMaxMin(modifier: number){
    this.mandelMax = this.mandelMax - modifier
    this.mandelMin = this.mandelMin + modifier
  }

  zoomin(): void{
    this.changeMandelMaxMin(this.zoomModifier)
  }

  zoomOut():void {
    this.changeMandelMaxMin(-this.zoomModifier)
  }

  mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

  drawManderbrot(ctx: CanvasRenderingContext2D, ){

    for (let y = 0; y < this.height; y++) {

      let x;
      for (x = 0; x < this.width; x++) {

        let a = this.mapValue(y, 0, this.height, this.mandelMin, this.mandelMax);
        let b = this.mapValue(x, 0, this.width, this.mandelMin, this.mandelMax);

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
            this.brightness = this.mapValue(iterationCount, 0, this.maxIterations, 255, 0);
            ctx.fillStyle = 'rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')';
          }

          iterationCount++;
        }
        ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
      }
      ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
    }

  }





  // async workerTest(i: string){
  //   debugger
  //   if (typeof Worker !== 'undefined') {
  //     const worker = new Worker(new URL('../webworkers/mandelbrot.worker', import.meta.url),
  //       {type: 'module'});
  //
  //     worker.onmessage = ({data}) => {
  //       debugger
  //       console.log(`page got message: ${data}`);
  //     };
  //
  //     worker.postMessage('worker' + i + 'finished computation');
  //   }
  // }
}
