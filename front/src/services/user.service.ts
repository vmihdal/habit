import axios from 'axios';
import { UserDto } from '../types/user.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getUserProfile = async (): Promise<UserDto> => {
  const response = await axios.get(`${API_URL}/users/me`, {
    withCredentials: true
  });
  return response.data;
}; 