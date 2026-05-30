export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  roles: { id: number; name: string; description?: string }[];
  lastLoginAt?: string;
  createdAt: string;
}
