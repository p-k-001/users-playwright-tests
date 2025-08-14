export interface User {
  email: string;
  password: string;
}

export interface UserDataRequest {
  name: string;
  email: string;
  age: string;
  role: string;
}

export interface UserDataResponse {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
  adult: boolean;
  ownerId: number;
}

export interface UserDataUpdate {
  name?: string;
  email?: string;
  age?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
}
