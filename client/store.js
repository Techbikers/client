import { compose, createStore, applyMiddleware } from "redux";
import persistState from "redux-localstorage";
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import { createTracker } from "redux-segment";

import apiMiddleware from "techbikers/middleware/api";
import ravenMiddleware from "techbikers/middleware/raven";
import rootReducer from "techbikers/reducers";

export default function configureStore(initialState = {}) {
  const loggerMiddleware = createLogger();
  const trackerMiddleware = createTracker();

  const authenticationSlicer = () => state => {
    const { state: authState } = state.authentication;

    if (authState === "authenticated") {
      return {
        authentication: state.authentication
      };
    } else {
      return {};
    }
  };

  const enhancer = compose(
    persistState(null, {
      slicer: authenticationSlicer
    }),
    applyMiddleware(
      apiMiddleware,
      ravenMiddleware,
      thunkMiddleware,
      routerMiddleware(browserHistory),
      trackerMiddleware,
      loggerMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("techbikers/reducers", () => {
      store.replaceReducer(require("techbikers/reducers").default);
    });
  }

  return store;
}