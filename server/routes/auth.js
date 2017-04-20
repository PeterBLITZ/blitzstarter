import { Router } from 'express';
import unsupportedMessage from '../db/unsupportedMessage';
import { controllers } from '../db';
import logger from '../lib/logger';

const log = logger(__filename);
const router = new Router();

const authController = controllers && controllers.auth;

if (authController) {
  router.get('/', authController.auth);
  router.get('/facebook', authController.facebook);
  router.get('/facebook/callback', authController.facebookCallback);
  router.post('/login', authController.login);
  router.post('/sol', authController.sol);
  router.post('/logout', authController.logout);
} else {
  log.warn(unsupportedMessage('auth routes'));
}

export default router;
