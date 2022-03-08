import devConfig from './dev.json';
import stgConfig from './stg.json';

const envFiles = new Map([
  ['dev', devConfig],
  ['stg', stgConfig],
]);

class EnvConfig {
  _env: string;

  constructor(env: string) {
    this._env = env;
  }

  getConfig() {
    return envFiles.get(this._env) || {};
  }
}

export default new EnvConfig(process.env.REACT_APP_APP_ENV || 'local');
