import * as _ from 'lodash';

export const exists = (data: any) => data && !_.isEmpty(data);

export const isNotEmptyArray = (data: any) =>
  data && _.isArray(data) && !_.isEmpty(data);

export const utils = { exists, isNotEmptyArray };

export default utils;
