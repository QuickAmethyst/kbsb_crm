/* eslint-disable no-console */

import config from '../config';

function debug(message?: unknown, ...optionalParams: unknown[]): void {
  if (!config.isDev) return;
  if (optionalParams.length > 0) {
    console.log(message, optionalParams);
    return;
  }
  console.log(message);
}

function error(err: Error, extra?: Record<string, unknown>, tags?: Record<string, unknown>): void {
  if (!config.isDev) return;

  console.error(err, extra, tags);
}

const log = {
  debug,
  error,
};

export default log;
