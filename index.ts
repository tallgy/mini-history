import { createEvents } from "./Events"; 
import { Action, Pathname, Search, Hash, Path, To, History, Listener, Blocker } from './types';

interface BrowserHistory extends History {};

interface BrowserHistoryOptions {
  window: Window
}

const createBrowserHistory = (options: BrowserHistoryOptions): BrowserHistory => {

  const { window } = options;
  const globalHistory = window.history;

  const listeners = createEvents<Listener>();
  const blockers = createEvents<Blocker>();
  let action = Action.Pop;

  const go = (delta: number) => {
    globalHistory.go(delta);
  }

  /**
   * 是否被允许跳转
   * @param action 
   * @param location 
   * @param retry 
   * @returns 
   */
  const allowTx = (action: Action, location: Location, retry: () => void) => {
    if (blockers.length) {
      blockers.call({ action, location, retry });
      return false;
    }
    return true;

    // 下面这个是简写的逻辑
    return (
      !blockers.length || (blockers.call({ action, location, retry}), false)
    );
  }

  /**
   * 在执行了跳转之后
   * @param nextAction 
   */
  const applyTx = (nextAction: Action) => {
    action = nextAction;
    listeners.call({ action, location });
  }

  const push = (to: To, state) => {
    let nextAction = Action.Push;

    const retry = () => {
      push(to, state);
    }

    if (allowTx(nextAction, location, retry)) {
      globalHistory.pushState(historyState, "", url)

      applyTx(nextAction);
    }
  }
  
  const replace = (to: To, state) => {
    let nextAction = Action.Replace;
    
    const retry = () => {
      replace(to, state);
    }

    if (allowTx(nextAction, location, retry)) {
      globalHistory.replaceState(historyState, "", url)
      applyTx(nextAction);
    }
  }

  const history: BrowserHistory = {
    action,
    listen: (listener: Listener) => {
      return listeners.push(listener)
    },
    block: (blocker: Blocker) => {
      return blockers.push(blocker);
    },
    go,
    back: () => {
      go(-1);
    },
    forward: () => {
      go(1);
    },
    push,
    replace
  }

  return history;

}
