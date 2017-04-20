import { GOOD_NEWS,
} from '../constants/App';

export function isGoodNews(isGood) {
  return {
    type: GOOD_NEWS,
    payload: isGood,
  }
}
