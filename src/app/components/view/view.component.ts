import {Component, Inject, OnInit} from '@angular/core';
import {MandelbrotService} from "../../services/mandelbrot.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  ctx: CanvasRenderingContext2D | undefined;
  constructor(@Inject(DOCUMENT) private doc: Document,
              private mandelbrotService: MandelbrotService) {
  }

  async generateSection(){
    for(let i = 0 ; i< 100 ; i++){
      await this.mandelbrotService.workerTest(i+'');
    }

  }

  ngOnInit(): void {
    //TODO create multiple calls
    this.generateSection();

    //Can be removed
    const canvas = this.doc.getElementById('canvas')  as HTMLCanvasElement ;
    const ctx = canvas.getContext("2d");
    if(ctx){
      this.mandelbrotService.getManderbrotSection(ctx,0, 500);
    }
  }

}
