import axios from 'axios';
import qs from 'qs';
import { getCookie } from './cookie';

export const request = async ( url, data ) => {
  data.me_id = getCookie('id');
  return await axios({
    method: 'POST',
    headers: {
      // 'Access-Control-Allow-Origin': 'http://127.0.0.1:8090/api',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    url: url,
    data: qs.stringify(data),
  })
}