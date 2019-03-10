import { combineReducers } from "redux";

import * as ui from "techbikers/auth/actions/ui";

export default combineReducers({
  emailSignIn
});

function emailSignIn(state = null, { type }) {
  switch (type) {
    case ui.SHOW_SIGNIN_ERROR_SCREEN:
      return "error";
    default:
      return state;
  }
}
