export interface User {
  user_id: number;
  user_name: string;
  email: string;
  password: string;
  accessToken?: string;
}

export interface UserLoginForm{
  email: string;
  password: string;
}

export interface LoginResponse {
  token:   string;
  message: string;
  results: Result[];
}

export interface Result {
  user_id:   number;
  user_name: string;
  email:     string;
  password:  string;
}
