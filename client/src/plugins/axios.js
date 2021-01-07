import globalAxios from 'axios';
import { apiUrl } from '../config';

const axios = globalAxios.create({
    baseURL: apiUrl,
    withCredentials: true
});

export default axios;
