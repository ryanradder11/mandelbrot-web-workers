import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import {ComputedResult} from "../interfaces/computed-result";

@Injectable({
  providedIn: 'root'
})
export class MandelbrotService {
  maxIterations = new BehaviorSubject<number>(25);
  calculationTime = new BehaviorSubject<number>(0);

  public mandelMin = -2.5;
  public mandelMax = 2.5;
  infinity = 9999;
  pixelSize = 1
  brightness = 1;
  width = 700;
  height = 700;
  zoomModifier = 0.25;

  constructor() {
  }


  changeMandelMaxMin(modifier: number) {
    this.mandelMax = this.mandelMax - modifier
    this.mandelMin = this.mandelMin + modifier
  }

  zoomin(): void {
    this.changeMandelMaxMin(this.zoomModifier)
  }

  zoomOut(): void {
    this.changeMandelMaxMin(-this.zoomModifier)
  }

  setMaxIterations(iterations: number): void {
    this.maxIterations.next(iterations);
  }

  mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

  drawMandelbrotWithWebworkers(ctx: CanvasRenderingContext2D, numberOfWorkers: number): void {
    const numberOfpixelsPerBatch = Math.round(this.height / numberOfWorkers)
    for (let y = 0; y < this.height; y = y + numberOfpixelsPerBatch) {
      this.dispatchWorker(y, numberOfpixelsPerBatch, ctx);
    }
  }

  drawMandelbrotSingleThreaded(ctx: CanvasRenderingContext2D): void {
    let computedResult: ComputedResult[] = [];
    const startTime = performance.now();

    for (let y = 0; y < this.height; y++) {

      let x;
      for (x = 0; x < this.width; x++) {

        let a = this.mapValue(y, 0, this.height, this.mandelMin, this.mandelMax);
        let b = this.mapValue(x, 0, this.width, this.mandelMin, this.mandelMax);

        let initialA = a;
        let initialB = b;

        for (let iterationCount = 0; iterationCount < this.maxIterations.value; iterationCount++) {

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

            //Not in set
            const brightness = this.mapValue(iterationCount, 0, this.maxIterations.value, 0, 255);
            computedResult.push({brightness: brightness, x: x, y: y, inSet: false});
            break;

          } else {

            //In Set
            const brightness = this.mapValue(iterationCount, 0, this.maxIterations.value, 255, 0);
            if (iterationCount === this.maxIterations.value - 1) {
              computedResult.push({brightness: brightness, x: x, y: y, inSet: true});
            }
          }
        }
      }
    }

    this.fillCanvas(ctx, computedResult).then( _ =>{
      //End time calculation
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      this.calculationTime.next(totalTime);
    });

  }

  private fillCanvas(ctx: CanvasRenderingContext2D, result: ComputedResult[]): Promise<void> {
    return  new Promise( (resolve) => {
      result.map(part => {
        ctx.fillStyle = 'rgb(' + part.brightness + ', ' + part.brightness + ', ' + part.brightness + ')';
        ctx.fillRect(part.y * this.pixelSize, part.x * this.pixelSize, this.pixelSize, this.pixelSize);
      });
      resolve();
    })
  }


  async dispatchWorker(initialY: number, pixels: number, ctx: CanvasRenderingContext2D) {
    const startTime = performance.now();
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../webworkers/mandelbrot.worker', import.meta.url),
        {type: 'module'});
        worker.onmessage = ({data}) => {

        //Fill canvas with result
        this.fillCanvas(ctx, data).then(_ => {
          //Stop time
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          this.calculationTime.next(totalTime);

          //Terminate worker
          worker.terminate();
        });
      };

      worker.postMessage({
        initialY: initialY,
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
