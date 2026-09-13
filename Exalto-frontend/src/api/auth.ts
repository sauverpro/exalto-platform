import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export interface RegisterData {
  full_name: string;
  email: string;
  phone_number?: string;
  password: string;
  role: string;
  // accountType: "individual" | "business"; 
  // company?: string; 
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  role: string;
  // company_name?: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}



export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);

  return response.data;
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
  return response.data;
};