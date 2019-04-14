import { combineReducers } from "redux";

import auth from "auth/reducers/ui";
import rides from "rides/reducers/ui";

export default combineReducers({
  auth,
  rides
});
