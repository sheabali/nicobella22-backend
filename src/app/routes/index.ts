import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { CompanyRoutes } from "../modules/company/company.routes";
import { EstimateRoutes } from "../modules/estimate/estimate.routes";
import { InvoiceRoutes } from "../modules/invoice/invoice.routes";
import { MechanicRoutes } from "../modules/mechanic/mechanic.routes";
import { ServiceRoutes } from "../modules/service/service.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { VehicleRoutes } from "../modules/vehicle/vehicle.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/mechanic",
    route: MechanicRoutes,
  },
  {
    path: "/company",
    route: CompanyRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/vehicle",
    route: VehicleRoutes,
  },
  {
    path: "/estimate",
    route: EstimateRoutes,
  },
  {
    path: "/invoice",
    route: InvoiceRoutes,
  },
  {
    path: "/service",
    route: ServiceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
