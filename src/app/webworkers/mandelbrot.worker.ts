/// <reference lib="webworker" />

import {ComputedResult} from "../interfaces/computed-result";

addEventListener('message', ({data}) => {

  const mapValue = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  let computedResult: ComputedResult[] = [];
  for (let y = data.initialY; y < data.height; y++) {
    let x;
    for (x = 0; x < data.width; x++) {

      let a = mapValue(y, 0, data.height, data.mandelMin, data.mandelMax);
      let b = mapValue(x, 0, data.width, data.mandelMin, data.mandelMax);

      let initialA = a;
      let initialB = b;

      for (let iterationCount = 0; iterationCount < data.maxIterations; iterationCount++) {


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
        if (result >= data.infinity) {

          //Not in set
          const brightness = mapValue(iterationCount, 0, data.maxIterations, 0, 255);
          computedResult.push({brightness: brightness, x: x, y: y, inSet: false});
          break;

        } else {

          //In Set
          const brightness = mapValue(iterationCount, 0, data.maxIterations, 255, 0);
          if (iterationCount === data.maxIterations - 1) {
            computedResult.push({brightness: brightness, x: x, y: y, inSet: true});
          }
        }
      }
    }
  }

  postMessage(computedResult);
});
