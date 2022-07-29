/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  debugger;
  const response = `worker response to ${data}`;
  postMessage(response);
});
