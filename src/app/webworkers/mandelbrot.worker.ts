/// <reference lib="webworker" />

import {map} from "rxjs";

addEventListener('message', ({ data }) => {

  const mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  let computedResult: {brightness:number, x: number, y: number, inSet: boolean}[] = [];
  for (let y = data.y; y < data.height; y++ ) {
    let x;
    for (x = 0; x < data.width; x++) {

      let a = mapValue(y, 0, data.height, data.mandelMin, data.mandelMax);
      let b = mapValue(x, 0, data.width, data.mandelMin, data.mandelMax);

      let initialA = a;
      let initialB = b;

      for (let iterationCount = 0;  iterationCount < data.maxIterations; iterationCount++) {


        //Echt component
        let aa = (a * a) - (b * b);

        //Denkbeeldig component
        let bb = (2 * a * b);

        //De initiele waarde is c
        a = aa + initialA;
        b = bb + initialB;

        //We willen de absolute waarde
        let result = Math.abs(a + b);

        const brightness = mapValue(iterationCount, 0, data.maxIterations, 0, 255);

          //Is het oneindig?
          if (result >= data.infinity) {

            //Niet in de set
            // const brightness =  255;
            if(iterationCount === data.maxIterations -1) {
              computedResult.push({brightness: brightness, x: x, y: y, inSet: false});
            }
            break;

          } else {

            const brightness = mapValue(iterationCount, 0, data.maxIterations, 255, 0);
            if(iterationCount === data.maxIterations -1) {
              computedResult.push({brightness: brightness, x: x, y: y, inSet: true});
            }
            //Wel in de set
            // data.brightness = mapValue(iterationCount, 0, data.maxIterations.value, 0, 200);
            // data.ctx.fillStyle = 'rgb(' + data.brightness + ', ' + data.brightness + ', ' + data.brightness + ')';
          }

        }

    }
  }

  const response = data.b;
  console.log(data.pixels);
  postMessage(computedResult);
});
