import nconf from 'nconf';
import path from 'path';

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

nconf.argv().env();

const env = nconf.get('NODE_ENV');
// nconf.file(env, path.join(__dirname, `config.${env}.json`));
nconf.file(env, path.join(path.resolve(), `/config/config.${env}.json`));

export default nconf;
