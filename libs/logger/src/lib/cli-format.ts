/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'winston';
import { Format } from 'logform';
import { inspect } from 'util';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const colorScheme: Record<string, (text: string) => string> = {
  info: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

const extractResponseTime = (inputString) => {
  // Find the index of 'responseTime'
  const responseTimeIndex = inputString.indexOf('responseTime');

  if (responseTimeIndex !== -1) {
    // Extract the substring starting from 'responseTime' to the end
    const substring = inputString.slice(responseTimeIndex);

    // Find the index of the first single quote after 'responseTime'
    const firstQuoteIndex = substring.indexOf("'");

    if (firstQuoteIndex !== -1) {
      // Extract the substring starting from the first single quote to the end
      const timeValueSubstring = substring.slice(firstQuoteIndex + 1);

      // Find the index of the closing single quote
      const closingQuoteIndex = timeValueSubstring.indexOf("'");

      if (closingQuoteIndex !== -1) {
        // Extract the responseTime value
        const responseTime = timeValueSubstring.slice(0, closingQuoteIndex);
        return responseTime;
      }
    }
  }

  return null;
};

const removeResponseTime = (inputString) => {
  const responseTimeValue = extractResponseTime(inputString);

  if (responseTimeValue !== null) {
    // Replace the entire 'responseTime' key and its value with an empty string
    const updatedString = inputString.replace(
      `responseTime: '${responseTimeValue}'`,
      '',
    );

    // Optionally, trim extra commas or whitespace
    const trimmedString = updatedString.replace(/,\s*}/g, '}').trim();

    return trimmedString;
  }

  return inputString;
};

export const customFormat = (): Format =>
  format.printf(({ context, level, timestamp, message, ms, ...meta }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const color = colorScheme[level];
    const cyanBright = clc.cyanBright;
    const yellow = clc.yellow;

    // Deduplicate meta component
    /* istanbul ignore next */
    const {
      component: componentName,
      [LEVEL]: metaLevel,
      [MESSAGE]: metaMessage,
      [SPLAT]: metaSplat,
      ...metadata
    } = meta;

    let formattedMeta = inspect(metadata, {
      colors: true,
      depth: null,
      compact: true,
    });

    const responseTime = extractResponseTime(formattedMeta) || null;
    formattedMeta = removeResponseTime(formattedMeta);

    return (
      `${cyanBright(`[${componentName}]`)} ` +
      `${color(level)} ` +
      ('undefined' !== typeof timestamp ? `${timestamp} ` : '') +
      ('undefined' !== typeof context
        ? `${cyanBright('[' + context + ']')} `
        : '') +
      `${color(message)} ` +
      `${formattedMeta}` +
      ('undefined' !== typeof ms ? ` ${cyanBright(ms)}` : '') +
      (responseTime ? yellow(` +${responseTime}ms`) : '')
    );
  });
