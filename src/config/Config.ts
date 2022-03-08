import base from './base.json';
import envConfig from './EnvConfig';
import get from 'lodash/get';
import merge from 'lodash/merge';

class Config {
  config: {};

  constructor() {
    const configOverwrite = envConfig.getConfig();
    this.config = merge(base, configOverwrite);
  }

  get(key: string, defaultValue?: any) {
    return get(this.config, key, defaultValue);
  }
}

export default new Config();
