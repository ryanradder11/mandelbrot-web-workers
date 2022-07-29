import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ViewComponent} from "./components/view/view.component";
import {MandelbrotService} from "./services/mandelbrot.service";

const routes: Routes = [
  {
    path: 'mandelbrot',
    providers: [MandelbrotService, Document],
    component: ViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
