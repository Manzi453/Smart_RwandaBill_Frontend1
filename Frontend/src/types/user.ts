export interface User {
  id: string;
  username: string;
  email: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}
