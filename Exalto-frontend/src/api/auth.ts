import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);

  return response.data;
};