

export type LoadedFunction = (arg?: any) => void
export type CallbackFunction = (...args: any[]) => void
export type Options = { timeout?: number }

export function waitFor(
    number: number,
    onFinished: CallbackFunction,
    options?: Options): LoadedFunction[] {
  let total = number;
  let return_values = new Array(number);

  return new Array(number).fill(0).map((_, i) => {
    return (arg) => {
      --total;
      return_values[i] = arg;
      if(!total){
        onFinished(...return_values);
      }
    }
  });
}

export default {
  waitFor,
};


/*

function test(){
  let [ load1, load2 ] = SCOPE.waitFor(2, (a, b) => {
    console.log("2 tasks finished:", a, b)
  });

  load1(2);
  load2(5);
}

function test2(){
  let onAllFinished: CallbackFunction = (a, b, c) => {
    console.log("everyone has finished eating:", a, b, c);
  };
  let [ finish1, finish2, finish3 ] = SCOPE.waitFor(3, onAllFinished);

  finish1("Tom");

  (async () => {
    await new Promise(res => setTimeout(res, 1000));
    finish3();
  })();

  finish2("Peter");
}

function test3(){

}


test();
test2();
test3();

/*****/