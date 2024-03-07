export interface User {
  user_name: string;
  email: string;
  password: string;
  error?: Error;
  accessToken?: any;
}

