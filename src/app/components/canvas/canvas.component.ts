import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MandelbrotService} from "../../services/mandelbrot.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements  AfterViewInit {
  ctx: CanvasRenderingContext2D | null | undefined;
  constructor(@Inject(DOCUMENT) private doc: Document,
              public mandelbrotService: MandelbrotService) {
  }

  // async generateSection(){
  //   for(let i = 0 ; i< 100 ; i++){
  //     await this.mandelbrotService.workerTest(i+'');
  //   }
  // }




  zoomIn(){
    this.mandelbrotService.zoomin();
    if (this.ctx) {
      this.mandelbrotService.drawMandelbrotSingleThreaded(this.ctx);
    }
  }

  zoomOut(){
    this.mandelbrotService.zoomOut();
    if (this.ctx) {
      this.mandelbrotService.drawMandelbrotSingleThreaded(this.ctx);
    }
  }

  setMaxIterations(iterations: number){
    this.mandelbrotService.setMaxIterations(iterations);
    if (this.ctx) {
      this.mandelbrotService.drawMandelbrotSingleThreaded(this.ctx);
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
      setTimeout(() => this.mandelbrotService.drawMandelbrotSingleThreaded(ctx), 1);
    }
  }

}
