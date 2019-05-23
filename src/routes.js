import React from "react";
import { Route, Switch } from "react-router-dom";
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

const token = localStorage.getItem("token");

if (token) {
  store.dispatch({ type: AUTHENTICATED });
}

// if (token) {
//   HTTP.get("account").then(function(resp) {
//     store.dispatch({
//       type: AUTHENTICATED,
//       payload: {
//         login: resp.data.login,
//         authority: resp.data.authority
//       }
//     });
//   });
// }

const AppRoutes = () => (
  <Provider store={store}>
    <App>
      <Switch>
        <Route exact path="/register" component={noRequireAuth(Register)} />
        <Route exact path="/login" component={noRequireAuth(Signin)} />
        <Route exact path="/aircrafts" component={requireAuth(AircraftList)} />
        <Route
          exact
          path="/aircrafts/new"
          component={requireAuth(AircraftForm)}
        />
        <Route path="/aircrafts/edit/:id" exact component={AircraftForm} />
        <Route exact path="/" component={Home} />
        <Route exact component={Page404} />
      </Switch>
    </App>
  </Provider>
);

export default AppRoutes;
