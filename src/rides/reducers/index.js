import { handleActions } from "redux-actions";

import * as actions from "rides/actions";

const defaultState = {
  registrationState: null
};

export default handleActions({
  [actions.chargeUserForRide]: state => ({
    ...state,
    registrationState: "processing"
  }),

  [actions.registrationFailure]: state => ({
    ...state,
    registrationState: "failed"
  }),

  [actions.registrationSuccess]: state => ({
    ...state,
    registrationState: null
  })
}, defaultState);
