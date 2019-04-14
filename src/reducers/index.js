import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import ui from "reducers/ui";
import app from "app/reducers";
import auth from "auth/reducers";
import entities from "reducers/entities";
import errors from "errors/reducers";
import page from "./page";
import notifications from "notifications/reducers";
import rides from "rides/reducers";

export default combineReducers({
  app,
  auth,
  entities,
  errors,
  page,
  rides,
  routing: routerReducer,
  notifications,
  ui
});
