import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MandelbrotService} from "../../services/mandelbrot.service";
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements  AfterViewInit {
  ctx: CanvasRenderingContext2D | null | undefined;
  useWorkers: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _useWorkers = false;
  selectedIterations = 25;
  numberOfWorkers = 1;

  constructor(@Inject(DOCUMENT) private doc: Document,
              public mandelbrotService: MandelbrotService) {
  }

  setUseWebworkers(useWorkers: boolean){
    this.useWorkers.next(useWorkers);
    this._useWorkers = useWorkers;
    this.drawMandelbrot();
  }

  setNumerOfWebworkers(numberOfWorkers: number){
    this.numberOfWorkers =numberOfWorkers;
    this.drawMandelbrot();
  }

  zoomIn(){
    this.mandelbrotService.zoomin();
    this.drawMandelbrot();
  }

  zoomOut(){
    this.mandelbrotService.zoomOut();
    this.drawMandelbrot();
  }

  setMaxIterations(iterations: number){
    this.mandelbrotService.setMaxIterations(iterations);
    this.drawMandelbrot();
  }

  private drawMandelbrot(): void{
    if (this.ctx) {
      this.ctx.clearRect(0,0, 700, 700);
      if(this.useWorkers.value){
        this.mandelbrotService.drawMandelbrotWithWebworkers(this.ctx, this.numberOfWorkers);
      }else {
        this.mandelbrotService.drawMandelbrotSingleThreaded(this.ctx);
      }
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.doc.getElementById('canvas')  as HTMLCanvasElement ;

    canvas.addEventListener('mousemove', function (evt: MouseEvent) {
      if(!mousePosDown || mousePosUp) {
        return;
      }

      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const rect = canvas.getBoundingClientRect();
      let mousePos: { x: number; y: number; } = evt;
        let rectWidht = ( (mousePos.x - rect.left) - mousePosDown.x );
        let rectHeight = (  (mousePos.y - rect.top) - mousePosDown.y);
        context.clearRect(mousePosDown.x,mousePosDown.y, rectWidht ,rectHeight);
        context.stroke();
        context.fill();
    }, false);

    let mousePosDown: { x: number; y: number; };
    canvas.addEventListener('mousedown', function (evt) {
      mousePosDown = getMousePos(canvas, evt);
    }, false);

    let mousePosUp: { x: any; y: number; };
    canvas.addEventListener('mouseup', function (evt) {
      mousePosUp = getMousePos(canvas, evt);
       // (mousePosDown, mousePosUp);
    }, false);

    function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
      let rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    if(ctx){
      //TODO Timeout or card will not load
      setTimeout(() => this.drawMandelbrot());
    }
  }

}
