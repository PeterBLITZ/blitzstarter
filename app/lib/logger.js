import Logdown from 'logdown';

const options = { markdown: false, prefix: 'client' };
const logger = new Logdown(options);

const ENV = process.env.NODE_ENV;
if (ENV === 'production') {
  Logdown.disable('*');
}

export default logger;
