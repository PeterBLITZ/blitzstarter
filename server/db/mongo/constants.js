import config from '../../../config';

export const db = process.env.MONGOHQ_URL || process.env.MONGODB_URI || config.get('mongoose:uri');

export default {
  db,
};
