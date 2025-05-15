import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { MechanicRoutes } from '../modules/mechanic/mechanic.routes';
import { CompanyRoutes } from '../modules/company/company.routes';
import { BookingRoutes } from '../modules/booking/booking.routes';
const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/mechanic',
    route: MechanicRoutes,
  },
  {
    path: '/company',
    route: CompanyRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
