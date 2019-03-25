import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import App from "./components/App";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import AircraftForm from "./entities/Aircraft/AircraftForm";
import AircraftList from "./entities/Aircraft/AircraftList";

const AppRoutes = () => (
  <App>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/aircrafts/new" component={AircraftForm} />
      <Route path="/aircrafts" component={AircraftList} />
      <Route component={Page404} />
    </Switch>
  </App>
);

export default AppRoutes;
