import moment from 'moment';

export const date = {
  /**
   * IS YEAR MONTH DAY
   *
   * @param {String}   date date string
   * @return {Boolean}      a flag to determine if the date is the valid format
   */
  isYearMonthDay: (date) => {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  },
};
