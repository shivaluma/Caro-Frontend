/* eslint-disable no-param-reassign */
import axios from 'axios';

// prod `https://shivaluma.wtf/caroapi/v1/`,
// dev `http://10.126.4.69:5000/api/v1/`
const instance = axios.create({
  baseURL: `http://10.126.4.69:5000/api/v1/admin`
});

// 10.126.4.69 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOGU5MTM4NzY0OTRlMGE2ZThkNWUxNCIsInVzZXJuYW1lIjoic2hpdmFsdW1hMSIsImRpc3BsYXlOYW1lIjoic2hpdmFsdW1hMSIsImlhdCI6MTYwMzYzNDU1NH0.N8cI-r4LKe5zbVxRyrCBkiTmfVrc9dyoC2aqryMCJeA
// api       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTNiOTA0Y2MwYWJmMTlkMDM5MjU4NyIsInVzZXJuYW1lIjoic2hpdmFsdW1hIiwiZGlzcGxheU5hbWUiOiJzaGl2YWx1bWEiLCJpYXQiOjE2MDM1MTY2ODF9.omnezGwWS6drn4wGFBPjjV6__yheMpZ3B4uJLXyAvb8';

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('whatisthis-admin');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
