interface Events<F> {
  length: number;
  push: (fn: F) => () => void;
  call: (args: any) => void;
}

/**
 * listen 和 block 的监听事件
 */
export function createEvents<F extends Function> (): Events<F> {
  const handlers: F[] = [];

  const push = (fn: F) => {
    handlers.push(fn);

    return () => {
      handlers.filter(handler => handler!==fn);
    }
  }

  const call = (...args) => {
    handlers.forEach(fn => fn(...args))
  }

  return {
    get length()  {
      return handlers.length;
    },
    push,
    call,
  }
}