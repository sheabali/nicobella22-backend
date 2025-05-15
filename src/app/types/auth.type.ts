import { UserRole } from './user.type';

export interface IJwtPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
