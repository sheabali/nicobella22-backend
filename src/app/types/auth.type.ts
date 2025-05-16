import { UserRole } from "./user.type";

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
