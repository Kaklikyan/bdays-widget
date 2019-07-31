import {apiDataEndpoint} from './constants';

class API {
  get = async params => {
    try {
      const response = await fetch(`${apiDataEndpoint}?${params}`);
      const json = await response.json();
      return json.users;
    } catch (e) {
      console.error('Error', e.message)
    }
  }
}

export default new API();