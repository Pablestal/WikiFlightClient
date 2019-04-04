import React from "react";
import { Route, Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AUTHENTICATED } from "./redux/creators";
import requireAuth from "./redux/requireAuth";
import noRequireAuth from "./redux/noRequireAuth";

//import Login from "./components/Login";
import Signin from "./components/Signin";
import Register from "./components/Register";
import App from "./components/App";
import Home from "./components/Home";
//import Page404 from "./components/Page404";
import AircraftForm from "./entities/Aircraft/AircraftForm";
import AircraftList from "./entities/Aircraft/AircraftList";
import history from "./history";

const user = localStorage.getItem("token");

if (user) {
  store.dispatch({ type: AUTHENTICATED });
}

const AppRoutes = () => (
  <Provider store={store}>
    <App>
      <Router history={history}>
        <div>
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
          <Route exact path="/" component={Home} />
          {/* <Route component={Page404} /> */}
        </div>
      </Router>
    </App>
  </Provider>
);

export default AppRoutes;
