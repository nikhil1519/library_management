import axios from 'axios';

const apiBaseURL = 'http://localhost:5000';

export const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use(
  (config) => {
    const ssoToken = localStorage.getItem('jwtToken');
    const token = ssoToken ? ssoToken : localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem('jwtToken');
  window.location.href = '/login';
};

const login = (credentials) => {
  return api.post(`/user/login`, credentials);
};

const logout = async() => {
  const response = await api.post(`/user/logout`);
  handleLogout();
  return response
};

const getBookList = () => {
  return api.get(`/book/list`);
};


const createBook = (data) => {
  return api.post(`/book/add`, data);
};

const createBorrowRequest = (data) => {
  return api.post(`/borrow_request/request`, data);
};

const getBorrowHistory = (csv=false) => {
  return api.get(`/borrow_request/history`, {
    responseType: csv ? 'blob': 'json',
    params: {
      csv: csv
    }
  });
};

const updateBorrowRequest = (id, data) => {
  return api.put(`/borrow_request/manage/${id}`, data)
}


const createUser = (data) => {
  return api.post(`/user/create`, data);
};

const getBookDetails = (id) => {
  return api.get(`/book/${id}`)
}

const apiService = {
  login,
  logout,
  createUser,
  getBookList,
  createBook,
  getBookDetails,
  getBorrowHistory,
  createBorrowRequest,
  updateBorrowRequest,
};

export default apiService;