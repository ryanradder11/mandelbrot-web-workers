import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MatSelectChange} from "@angular/material/select";

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {
   maxIterations = new BehaviorSubject<number>(25);
   calculationTime = new BehaviorSubject<number>(0);

   public mandelMin = -2.5;
   public mandelMax = 2.5;
   infinity = 400;
   pixelSize = 1
   brightness = 1;
   width = 700;
   height = 700;
   zoomModifier = 0.25;

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

  setMaxIterations(iterations: number): void{
    this.maxIterations.next(iterations);
  }

  mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

  drawMandelbrotWithWebworkers(ctx: CanvasRenderingContext2D, numberOfWorkers: number){


    const numberOfpixelsPerBatch = Math.round(this.height / numberOfWorkers)

    for (let y = 0; y < this.height; y = y + numberOfpixelsPerBatch) {

      this.workerTest(y, numberOfpixelsPerBatch, ctx);

    }



  }

  drawMandelbrotSingleThreaded(ctx: CanvasRenderingContext2D ){

    const startTime = performance.now();

    for (let y = 0; y < this.height; y++) {

      let x;
      for (x = 0; x < this.width; x++) {

        let a = this.mapValue(y, 0, this.height, this.mandelMin, this.mandelMax);
        let b = this.mapValue(x, 0, this.width, this.mandelMin, this.mandelMax);

        let initialA = a;
        let initialB = b;

        let iterationCount = 0;

        while (iterationCount < this.maxIterations.value) {

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

          } else {

            //Wel in de set
            this.brightness = this.mapValue(iterationCount, 0, this.maxIterations.value, 255, 50);
            ctx.fillStyle = 'rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')';
          }

          iterationCount++;
        }
        ctx.fillStyle = 'rgb(' + this.brightness + ', ' + this.brightness + ', ' + this.brightness + ')';
        ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
      }
      ctx.fillRect(y * this.pixelSize, x * this.pixelSize, this.pixelSize, this.pixelSize);
    }
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    this.calculationTime.next(totalTime);

  }



  async workerTest(initialY: number, pixels: number, ctx: CanvasRenderingContext2D){
    const startTime = performance.now();
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../webworkers/mandelbrot.worker', import.meta.url),
        {type: 'module'});

      worker.onmessage = ({data}) => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        this.calculationTime.next(totalTime);
        const mapPart : { brightness: number, x: number, y: number, inSet: boolean }[] = data;
        mapPart.map(part => {
          if(part.inSet){
            ctx.fillStyle = 'rgb(' + part.brightness + ', ' + part.brightness + ', ' + part.brightness + ')';
            ctx.fillRect(part.y * this.pixelSize, part.x * this.pixelSize, this.pixelSize, this.pixelSize);
          }else {

          }
        });

        worker.terminate();
      };

      worker.postMessage({
        y: initialY,
        pixels: pixels,
        width: this.width,
        height: this.height,
        mandelMin: this.mandelMin,
        mandelMax: this.mandelMax,
        maxIterations: this.maxIterations.value,
        infinity: this.infinity,
        brightness: this.brightness,
      });
    }
  }
}
