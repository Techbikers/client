import { takeEvery, call, fork, put } from "redux-saga/effects";
import { replace } from "react-router-redux";
import { schema } from "normalizr";

import { callApi } from "utils/api";
import {
  createTextNotification,
  createErrorNotification
} from "notifications/actions";
import * as actions from "fundraisers/actions";

export const FundraiserSchema = new schema.Entity("fundraiser");

/**
 * Fetch all fundraisers
 */
export function* fetchActiveFundraisers() {
  return yield call(callApi, "/fundraisers/", {}, [FundraiserSchema]);
}

/**
 * Callback that runs when returning from the JustGiving OAuth flow
 * @param {Object} payload
 * @param {string} payload.code   Authentication code returned from JustGiving
 * @param {number} payload.rideId ID of the ride linked to the fundraising page
 * @param {number} payload.userId ID of the user creating the page
 */
export function* createFundraiser({ payload }) {
  const { rideId, userId, code } = payload;

  // Make a request to the backend to create the fundraising page
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ride: rideId,
      user: userId,
      auth_code: code // eslint-disable-line camelcase
    })
  };
  const result = yield call(callApi, `/rides/${rideId}/riders/${userId}/fundraiser`, fetchOptions, FundraiserSchema);

  // Redirect the user to the ride page
  yield put(replace(`/rides/${rideId}`));

  // Show a notification so the user knows what has happened
  if (result.error) {
    const { error } = result.error;
    if (error === "invalid_grant") {
      yield put(createErrorNotification("Sorry, we failed to create your fundraising page. Please try again."));
    } else if (error.id && error.id === "PageShortNameAlreadyExists") {
      yield put(createErrorNotification("Hmm, it looks like you might already have a fundraising page. Please email help@techbikers.com"));
    } else {
      yield put(createErrorNotification("Whoops! Something went wrong and we couldn't create your fundraising page. Email help@techbikers.com for help."));
    }
  } else {
    yield put(createTextNotification("Your fundraising page has been created successfully!"));
  }
}

export default function* root() {
  yield [
    fork(takeEvery, actions.FETCH_ACTIVE_FUNDRAISERS, fetchActiveFundraisers),
    fork(takeEvery, actions.CREATE_FUNDRAISER, createFundraiser)
  ];
}
