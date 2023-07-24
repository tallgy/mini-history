
/** action 的属性 */
export enum Action {
  /** 默认状态 */
  Pop = "POP",
  /** 调用 push 时设置 */
  Push = "PUSH",
  /** 调用 replace 时的值 */
  Replace = "REPLACE",
}


export type Pathname = string;
export type Search = string;
export type Hash = string;

export type Path = {
  pathname: Pathname;
  search: Search;
  hash: Hash;
}

export type To = string | Partial<Path>;


export interface Update {
  action: Action;
  location
}

/** 监听 */
export interface Listener {
  (update: Update): void;
};

export interface Transition extends Update {
  retry: () => void;
}

/** block 阻塞 */
export interface Blocker extends Update {
  (tx: Transition): void;
}

export interface History {
  readonly action: Action;
  readonly location;
  /** 创建链接 */
  createHref: (to: To) => string;
  /** 监听 */
  listen: (listener: Listener) => () => void;
  /** 阻塞 */
  block: (blocker: Blocker) => () => void;
  /** push 方法 */
  push: (to: To, state) => void;
  /** go 方法 */
  go: (delta: number) => void;

  back: () => void;
  replace: (to: To, state) => void;
  forward: () => void;
}

type Key = string;

export interface Location extends Path {
  state: unknown;
  key: Key;
}
