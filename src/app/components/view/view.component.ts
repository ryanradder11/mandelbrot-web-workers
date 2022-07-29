import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  ctx: any;
  constructor(document: Document) {
  }

  ngOnInit(): void {
    const canvas = document.getElementById('canvas')  as HTMLCanvasElement ;
    debugger
    if(canvas){
      this.ctx = canvas.getContext("2d");
      this.ctx.lineTo(150, 25);
      this.ctx.arc(100,75,50,0,2*Math.PI);
      this.ctx.stroke();
    }
  }

}
