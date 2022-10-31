/**
 * Custom filters for use in eleventy templates.
 */
 'use strict';

module.exports = {

  /**
   * Filter transforms a date into a human readable date phrase for releases.
   * Transforms `'YYYY-MM-DD'` into `'Released on MonthFull Date, YYYY'` where:
   *  - YYYY is the full year
   *  - MM is the month (01 for January, 12 for December, etc)
   *  - DD is the date, in range of 01-31
   *  - MonthFull is the month's full name using en_us locale
   *  - Date is DD without the leading 0
   * @param {string} date The date string, in `YYYY-MM-DD` format
   * @returns {string} The transformed date phrase.
   */
  releasedOn: (date) => {
    const tokens = date.split('-');
    const _date = new Date(
      parseInt(tokens[0]),
      parseInt(tokens[1]) - 1,
      parseInt(tokens[2])
    )
    const month = _date.toLocaleString('en-us', { month: 'long' });
    return `Released on ${month} ${_date.getUTCDate()}, ${_date.getUTCFullYear()}`;
  },

  /**
   * Filter converts a tag name to its permalink url page.
   * @param {string} tag - the input tag name, ie the release's version 
   * @returns {string} the permalink
   */
  releaseUrl: (tag) => `/downloads/${tag}/`

}
