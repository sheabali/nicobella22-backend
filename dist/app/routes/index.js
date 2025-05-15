"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const mechanic_routes_1 = require("../modules/mechanic/mechanic.routes");
const company_routes_1 = require("../modules/company/company.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/mechanic',
        route: mechanic_routes_1.MechanicRoutes,
    },
    {
        path: '/company',
        route: company_routes_1.CompanyRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
