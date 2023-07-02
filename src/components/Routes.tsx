import React from "react";

import { Route } from "@tanstack/react-location";
// pages
import Authmiddleware from "./AuthMiddleware";
import Auth from "@app/pages/Auth/Auth";
import Dashboard from "@app/pages/Dashboard";
import Report from "@app/pages/Report/Report";
import Forecast from "@app/pages/Forecast/Forecast";
import CheckAuthMiddleware from "./CheckAuthMiddleware";

const routes: Route[] = [
   {
      path: '/',
      element: (
            <CheckAuthMiddleware>
               <Auth />
            </CheckAuthMiddleware>
      )
   },
   {
      path: '/dashboard',
      element: (
         <Authmiddleware>
            <Dashboard />
         </Authmiddleware>
      )
   },
   {
      path: '/report',
      element: (
         <Authmiddleware>
            <Report />
         </Authmiddleware>
      )
   },
   {
      path: '/forecast',
      element: (
         <Authmiddleware>
            <Forecast />
         </Authmiddleware>
      )
   },
]

export default routes;