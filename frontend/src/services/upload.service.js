import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8080/api/transactions/';

class UploadService {
  upload(file) {
    const user = AuthService.getCurrentUser();

    const formData = new FormData();
    formData.append('file', file);

    return axios.post(API_URL + 'upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': user.accessToken
      }
    });
  }
}

export default new UploadService();
