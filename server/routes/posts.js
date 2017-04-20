import { Router } from 'express';
import unsupportedMessage from '../db/unsupportedMessage';
import { controllers } from '../db';
import logger from '../lib/logger';

const log = logger(__filename);
const router = new Router();

const postsController = controllers && controllers.posts;

if (postsController) {
  router.get('/post', postsController.all);
  router.post('/post', postsController.add);
  router.post('/post/:postId/like', postsController.like);
  router.post('/post/:postId/dislike', postsController.dislike);
} else {
  log.warn(unsupportedMessage('posts routes'));
}

export default router;
