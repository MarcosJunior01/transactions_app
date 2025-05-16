import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(email, password) { 
  return axios
    .post(API_URL + 'signin', {
      email, 
      password
    })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.accessToken);
      }
      return response.data;
    });
}

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, cpf, password, role = 'user') {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      cpf,
      password,
      role
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();