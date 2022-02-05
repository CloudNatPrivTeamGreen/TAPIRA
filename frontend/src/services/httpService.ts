import axios from 'axios';
import qs from 'qs';

import AppConsts from '../lib/appconst';

const http = axios.create({
    baseURL: AppConsts.appBaseUrl,
    timeout: 30000,
    paramsSerializer: function(params) {
        return qs.stringify(params, {
            encode: false
        });
    },
});

export default http;