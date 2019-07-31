import Bowser from "bowser";
import moment from 'moment';
import API from './API';

export const getPrevData = async () => {
  const start = moment().subtract(2, 'weeks').format('MM.DD');
  const finish = moment().subtract(1, 'days').format('MM.DD');
  const params = `dateFrom=${start}&dateTo=${finish}`;
  const response = await API.get(params);
  const sorted = await sortByBirthday(response, 'prev');
  return sorted;
}

export const getCurrentData = async () => {
  const isLeapYear = moment().isLeapYear();
  const start = moment().format('MM.DD');
  const finish = !isLeapYear && moment().format('MM.DD') === '02.28' ? '02.29' : moment().format('MM.DD');
  const params = `dateFrom=${start}&dateTo=${finish}`;
  const response = await API.get(params);
  const sorted = !isLeapYear ? sortByBirthday(response) : sortByLastName(response);
  return sorted;
}

export const getNextData = async () => {
  const start = moment().add('1', 'days').format('MM.DD');
  const finish = moment().add('2', 'weeks').format('MM.DD');
  const params = `dateFrom=${start}&dateTo=${finish}`;
  const response = await API.get(params);
  const sorted = await sortByBirthday(response, 'next');
  return sorted;
}

export const determineIsDesktop = () => {
  const result = Bowser.getParser(window.navigator.userAgent).parsedResult;
  return result.platform.type === 'desktop'; 
}

const sortByLastName = data => {
  return data.sort((a, b) => {
    const aPieces = a.name.split(' ');
    const aLastName = aPieces[aPieces.length - 1].toUpperCase();
    const bPieces = b.name.split(' ');
    const bLastName = bPieces[bPieces.length - 1].toUpperCase();
    return (aLastName < bLastName) ? -1 : (aLastName > bLastName) ? 1 : 0;
  });
}

const sortByBirthday = (data, type) => {
  const sortedByLastName = sortByLastName(data);
  return sortedByLastName.sort((a, b) => {
    const aDate = moment(a.birthday).format('MM.DD');
    const bDate = moment(b.birthday).format('MM.DD');
    if (type === 'prev') {
      return (aDate > bDate) ? -1 : (aDate < bDate) ? 1 : 0;
    }
    return (aDate < bDate) ? -1 : (aDate > bDate) ? 1 : 0;
  });
}
