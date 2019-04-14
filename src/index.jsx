import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import * as serviceWorker from './serviceWorker';
import routes from "routes";
import configureStore from "store";
import { init } from "app/actions";
import authSagas from "auth/sagas";
import chapterSagas from "chapters/sagas";
import rideSagas from "rides/sagas";
import sponsorSagas from "sponsors/sagas";
import userSagas from "users/sagas";
import notificationSagas from "notifications/sagas";
import fundraiserSagas from "fundraisers/sagas";

const initialState = {
  page: {
    meta: {
      "og:image": "https://techbikers.com/static/images/techbikers_144px.png",
      "og:title": "Techbikers - Paris to London charity cycle ride",
      "og:url": "https://techbikers.com",
      "og:description": "On June 24th, 60+ techies will ride from Paris to London. Over the 3 day, 200 mile ride they will raise $75000+ for Room to Read."
    }
  }
};

const sagas = [
  authSagas,
  chapterSagas,
  rideSagas,
  sponsorSagas,
  userSagas,
  notificationSagas,
  fundraiserSagas
];

const store = configureStore(initialState, sagas);
const history = syncHistoryWithStore(browserHistory, store);

// Dispatch an init event to know the app is ready
store.dispatch(init());

if (!global.Intl) {
  Promise.all([
    import("intl"),
    require("intl/locale-data/jsonp/en.js")
  ]).then(() => {
    renderApp();
  });
} else {
  renderApp();
}

function renderApp() {
  render(
    <Provider store={store}>
      <Router history={history} children={routes} />
    </Provider>,
    document.getElementById("app")
  );
}

// Setup the service service worker
// Note that this isn't setup to default to offline support.
serviceWorker.unregister();
