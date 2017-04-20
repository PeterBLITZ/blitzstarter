import { GOOD_NEWS } from '../types/App';

export function isGoodNews(isGood) {
  return {
    type: GOOD_NEWS,
    payload: isGood,
  };
}
