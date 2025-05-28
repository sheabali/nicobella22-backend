"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_routes_1 = require("../modules/account/account.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_routes_1 = require("../modules/booking/booking.routes");
const company_routes_1 = require("../modules/company/company.routes");
const estimate_routes_1 = require("../modules/estimate/estimate.routes");
const invoice_routes_1 = require("../modules/invoice/invoice.routes");
const mechanic_routes_1 = require("../modules/mechanic/mechanic.routes");
const needHelp_routes_1 = require("../modules/needHelp/needHelp.routes");
const service_routes_1 = require("../modules/service/service.routes");
const user_routes_1 = require("../modules/user/user.routes");
const vehicle_routes_1 = require("../modules/vehicle/vehicle.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/mechanic",
        route: mechanic_routes_1.MechanicRoutes,
    },
    {
        path: "/company",
        route: company_routes_1.CompanyRoutes,
    },
    {
        path: "/booking",
        route: booking_routes_1.BookingRoutes,
    },
    {
        path: "/vehicle",
        route: vehicle_routes_1.VehicleRoutes,
    },
    {
        path: "/estimate",
        route: estimate_routes_1.EstimateRoutes,
    },
    {
        path: "/invoice",
        route: invoice_routes_1.InvoiceRoutes,
    },
    {
        path: "/service",
        route: service_routes_1.ServiceRoutes,
    },
    {
        path: "/admin",
        route: account_routes_1.AccountRoutes,
    },
    {
        path: "/need-help",
        route: needHelp_routes_1.NeedHelpRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
