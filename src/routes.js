import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AUTHENTICATED } from "./redux/actions";
import requireAuth from "./redux/requireAuth";
import noRequireAuth from "./redux/noRequireAuth";
//import { HTTP } from "./common/http-common";

import Signin from "./components/Signin";
import Register from "./components/Register";
import App from "./components/App";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import AircraftForm from "./entities/Aircraft/AircraftForm";
import AircraftList from "./entities/Aircraft/AircraftList";
import history from "./history";

const token = localStorage.getItem("token");

if (token !== null) {
  store.dispatch({ type: AUTHENTICATED });
}

// if (token !== null) {
//   HTTP.get("account").then(res => {
//     store.dispatch({ type: AUTHENTICATED, payload: res.data });
//   });
// }

const AppRoutes = () => (
  <Provider store={store}>
    <App>
      <Router history={history}>
        <Switch>
          <Route exact path="/register" component={noRequireAuth(Register)} />
          <Route exact path="/login" component={noRequireAuth(Signin)} />
          <Route
            exact
            path="/aircrafts"
            component={requireAuth(AircraftList)}
          />
          <Route
            exact
            path="/aircrafts/new"
            component={requireAuth(AircraftForm)}
          />
          <Route path="/aircrafts/edit/:id" exact component={AircraftForm} />
          <Route exact path="/" component={Home} />
          <Route exact component={Page404} />
        </Switch>
      </Router>
    </App>
  </Provider>
);

export default AppRoutes;
