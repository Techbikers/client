import { handleActions } from "redux-actions";

import * as actions from "techbikers/auth/actions";

export default handleActions({
  [actions.sendSignInLinkToEmail]: state => ({
    ...state,
    state: "loading"
  }),

  [actions.waitForEmailVerification]: (state, { payload }) => ({
    ...state,
    state: "verifying",
    emailForSignIn: payload
  }),

  [actions.authSuccess]: (state, { payload }) => ({
    ...state,
    state: "authenticated",
    emailForSignIn: null,
    ...payload
  }),

  [actions.authFailure]: state => ({
    ...state,
    state: "unauthenticated",
    emailForSignIn: null
  }),

  [actions.logout]: () => ({
    state: "unauthenticated",
    claims: {}
  }),
}, {
  state: "unauthenticated",
  claims: {}
});
