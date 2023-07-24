import { To, Location } from './types';

const createKey = () {
  return Math.random().toString(36).substr(2, 8);
}

export const getLocation = (to: To, state: any = null): Location => {
  return {
    pathname: '',
    search: '',
    hash: '',
    // ...to,
    key: createKey(),
    state,
  }
}
