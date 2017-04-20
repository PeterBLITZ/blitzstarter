/* eslint import/prefer-default-export: 0 */

import { GOOD_NEWS } from '../constants/App';

export function isGoodNews(isGood) {
  return {
    type: GOOD_NEWS,
    payload: isGood,
  };
}
