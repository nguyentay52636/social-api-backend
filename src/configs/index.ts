import appConfig from './app.config';
import jwtConfig from './jwt.config';
import mongoConfig from './mongoose.config';

export { appConfig, jwtConfig, mongoConfig };
export { mongooseConfig } from './database.config';
export { jwtModuleConfig } from './jwt-module.config';

export const configs = [appConfig, jwtConfig, mongoConfig];
