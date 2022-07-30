import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MandelbrotService} from "../../services/mandelbrot.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements  AfterViewInit {
  ctx: CanvasRenderingContext2D | undefined;
  constructor(@Inject(DOCUMENT) private doc: Document,
              private mandelbrotService: MandelbrotService) {
  }

  // async generateSection(){
  //   for(let i = 0 ; i< 100 ; i++){
  //     await this.mandelbrotService.workerTest(i+'');
  //   }
  // }


  ngAfterViewInit(): void {
    const canvas = this.doc.getElementById('canvas')  as HTMLCanvasElement ;
    const ctx = canvas.getContext("2d");
    if(ctx){
      //TODO Timeout or card will not load
      setTimeout(() => this.mandelbrotService.drawManderbrot(ctx), 1);
    }
  }

}
