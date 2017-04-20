import { default as authRoutes } from './auth';
import { default as postsRoute } from './posts';

const apiRoutes = [
  postsRoute,
]

const initRoutes = (app) => {
  app.use('/auth', authRoutes);
  app.use('/api/v0', apiRoutes);
}

export default initRoutes;
