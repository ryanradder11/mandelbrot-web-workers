import {Component, Inject, OnInit} from '@angular/core';
import {MandelbrotService} from "../../services/mandelbrot.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  ctx: any;
  constructor(@Inject(DOCUMENT) private doc: Document,
              private mandelbrotService: MandelbrotService) {
  }

  async generateSection(){
    await this.mandelbrotService.workerTest();
  }

  ngOnInit(): void {
    //TODO create multiple calls
    this.generateSection();

    //Can be removed
    const canvas = this.doc.getElementById('canvas')  as HTMLCanvasElement ;
    debugger
    if(canvas){
      const ctx = canvas.getContext("2d");
      this.mandelbrotService.getManderbrotSection(ctx,0, 500);
    }
  }

}
