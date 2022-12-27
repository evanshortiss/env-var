
export function isNode (): boolean {
  // https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
  return new Function('try {return this===global;}catch(e){return false;}')();
}