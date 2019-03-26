import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import App from "./components/App";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import AircraftForm from "./entities/Aircraft/AircraftForm";
import AircraftList from "./entities/Aircraft/AircraftList";
import history from "./history";

const AppRoutes = () => (
  <App>
    <Switch history={history}>
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/aircrafts" component={AircraftList} />
      <Route exact path="/aircrafts/new" component={AircraftForm} />
      <Route exact path="/" component={Home} />
      <Route component={Page404} />
    </Switch>
  </App>
);

export default AppRoutes;
