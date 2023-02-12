import React, { Fragment } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Tables } from "./pages/Tables";
import { Hero404 } from "./pages/Hero404";
import { Profile } from "./pages/Profile";

const Routes = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Route exact path="/Cart-admin/" render={() => <Dashboard />} />
        <Route path="/Cart-admin/tables" component={Tables} />
        <Route path="Cart-admin/hero404" component={Hero404} />
        <Route path="Cart-admin/profile" component={Profile} />
      </BrowserRouter>
    </Fragment>
  );
};

export default Routes;
