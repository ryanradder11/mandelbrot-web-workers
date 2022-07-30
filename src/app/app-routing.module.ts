import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CanvasComponent} from "./components/canvas/canvas.component";

const routes: Routes = [
  {
    path: 'mandelbrot',
    component: CanvasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
