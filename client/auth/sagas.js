import moment from "moment";
import { takeEvery, fork, put, select, call } from "redux-saga/effects";
import { replace } from "react-router-redux";

import config from "techbikers/config";
import { INIT } from "techbikers/app/actions";
import { auth } from "techbikers/utils/firebase";
import {
  createTextNotification,
  createErrorNotification
} from "techbikers/notifications/actions";
import { fetchUserById } from "techbikers/users/actions";
import {
  getAuthState,
  getAuthenticatedUserId,
  getEmailForSignIn
} from "techbikers/auth/selectors";
import * as actions from "techbikers/auth/actions";

/**
 * Runs on app initialisation to check the authentication state and
 * fetch any required user information (profile, refreshed token etc)
 */
export function* checkAuthState() {
  const { state, claims: { exp } } = yield select(getAuthState);

  if (state === "authenticated") {
    // Check that the token is still valid
    if (moment().isAfter(exp * 1000)) {
      // Log the user out
      yield put(actions.logout());
    } else {
      // Update user information
      yield call(completeAuthentication);
    }
  }
}

/**
 * Authenticate the user with a magic link
 * @param {Object} payload The email address used to signin
 */
export function* sendSignInLinkToEmail({ payload }) {
  const { email, returnTo } = payload;
  const actionCodeSettings = {
    url: `${config.FIREBASE_AUTH_REDIRECT}?returnTo=${returnTo || "/"}`,
    handleCodeInApp: true
  };

  try {
    yield call([auth, auth.sendSignInLinkToEmail], email, actionCodeSettings);
    yield [
      put(actions.waitForEmailVerification(email)),
      put(replace("/signin/confirm"))
    ];
  } catch (error) {
    yield [
      put(actions.authFailure()),
      put(createErrorNotification("Something seems to have gone wrong. Please try again."))
    ];
  }
}

/**
 * Handle the callback from a redirected authentication call to Auth0
 * @param {string} payload Location to return to after authenticated
 */
function* authCallback({ payload }) {
  // If there is no hash then redirect as they have probably got here by mistake
  if (!auth.isSignInWithEmailLink(window.location.href)) {
    yield put(replace("/"));
    return;
  }

  const email = yield select(getEmailForSignIn);

  if (!email) {
    // Can't sign the user in
  }

  try {
    // Try authenticating the user
    const { user, additionalUserInfo } = yield call([auth, auth.signInWithEmailLink], email, window.location.href);

    // Auth successful, get the ID token
    const idTokenResult = yield call([user, user.getIdTokenResult]);

    // Pass the new token result through to the reducer
    yield put(actions.authSuccess(idTokenResult));
  } catch (error) {
    // Authentication failed
    yield put(actions.authFailure());
  } finally {
    // Redirect the user to the right place
    yield put(replace(payload || "/"))
  }
}

/**
 * Handle the callback from an OAuth provider
 * @param {Object} payload
 * @param {string} payload.code  The authorization code returned from the provider
 * @param {Object} payload.state The state returned back to us via the provider
 */
function* oauthCallback({ payload }) {
  // If there is no payload then send them home
  if (!payload) {
    yield put(replace("/"));
    return;
  }

  const { code, state: { callback } } = payload;

  // Dispatch any callback actions
  if (callback && typeof callback.type === "string") {
    // Get details about the next action and add the code into
    // the payload so the action can use it
    const action = { type: callback.type, payload: { code, ...callback.payload } };
    yield put(action);
  }
}

export function* completeAuthentication() {
  // Get the full profile for the authenticated user
  const userId = yield select(getAuthenticatedUserId);
  yield put(fetchUserById(userId));
}

export function* logout() {
  yield put(createTextNotification("You have successfully logged out!"));
}

export default function* root() {
  yield [
    fork(takeEvery, INIT, checkAuthState),
    fork(takeEvery, actions.SEND_SIGNIN_LINK_TO_EMAIL, sendSignInLinkToEmail),
    fork(takeEvery, actions.AUTHENTICATION_CALLBACK, authCallback),
    fork(takeEvery, actions.OAUTH_CALLBACK, oauthCallback),
    fork(takeEvery, actions.AUTHENTICATION_SUCCESS, completeAuthentication),
    fork(takeEvery, actions.LOGOUT, logout)
  ];
}
