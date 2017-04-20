import mongoose from 'mongoose';
import { db } from './constants';
import loadModels from './models';
import { isDebug } from '../../../config/app';
import logger from '../../lib/logger';

const log = logger(__filename);

export default () => {

  if (isDebug) {
    mongoose.set('debug', (collectionName, methodName, query, doc, ...rest) => {
      log.log('debug', 'mongo', collectionName, methodName, query, doc, rest)
    })
  }

  // Find the appropriate database to connect to, default to localhost if not found.
  const connect = () => {
    mongoose.connect(db, (err) => {
      if (err) {
        log.error(`===>  Error connecting to ${db}`);
        log.error(`Reason: ${err}`);
      } else {
        log.info(`===>  Succeeded in connecting to ${db}`);
      }
    });
  };
  connect();

  mongoose.connection.on('error', log.error);
  mongoose.connection.on('disconnected', connect);

  loadModels();
};
