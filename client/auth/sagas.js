import moment from "moment";
import { takeEvery, fork, put, select, call, take, race } from "redux-saga/effects";
import { replace } from "react-router-redux";

import { INIT } from "techbikers/app/actions";
import { addError } from "techbikers/errors/actions";
import authService from "techbikers/auth/services";
import {
  createTextNotification,
  createErrorNotification
} from "techbikers/notifications/actions";
import { fetchUserById } from "techbikers/users/actions";
import {
  getAuthState,
  getAuthenticatedUserId,
  getAuthCallback
} from "techbikers/auth/selectors";
import * as actions from "techbikers/auth/actions";
import * as ui from "techbikers/auth/actions/ui";

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
 * Authenticate the user with Auth0 using the Username-Password connection
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
export function* authenticateUser({ payload }) {
  const { error, response } = yield authService.login(payload.email, payload.password);

  if (error) {
    // Authentication failed
    yield [
      put(addError("authentication", error.code, error.description)),
      put(actions.authFailure())
    ];
  } else {
    // Authenticated successful, log the user in on the client
    yield put(actions.authSuccess(response));
  }
}

/**
 * Handle the callback from a redirected authentication call to Auth0
 * @param {string} payload The URL on the callback URL
 */
function* authCallback({ payload }) {
  // If there is no hash then redirect as they have probably got here by mistake
  if (!payload) {
    yield put(replace("/"));
    return;
  }

  // First we need to parse the hash that was passed as the payload
  const { error, result } = yield authService.parseHase(payload);

  if (error) {
    // Authentication failed
    yield put(actions.authFailure(error));
  } else {
    // Authenticated successful
    // Pass the new tokens through to the reducer
    yield put(actions.authSuccess(result));

    // Get information from the store about what to do next
    const { returnTo, action } = yield select(getAuthCallback);

    // Dispatch any callback actions
    if (action && typeof action.type === "string") {
      yield put(action);
    }

    // Now redirect the user and clear the store of callback info
    yield [
      put(replace(returnTo || "/")),
      put(actions.clearAuthCallback())
    ];
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

/**
 * Change the password (knowing the current one)
 * @param {Object} payload
 * @param {string} payload.email         - Users email address
 * @param {string} payload.new_password1 - New password
 * @param {string} payload.new_password2 - New password confirmation
 */
export function* changePassword({ payload }) {
  const { response } = yield authService.changePassword(payload.email, payload.new_password1);

  if (response) {
    // TODO
  }
}

/**
 * Start the process of resetting a password by sending a reset email
 * @param {string} payload - Email address
 */
export function* resetPassword({ payload }) {
  const [{ error }] = [
    yield put(ui.updatePasswordResetStatus("loading")),
    yield call(authService.changePassword, payload)
  ];

  if (!error) {
    yield put(ui.updatePasswordResetStatus("emailed"));
  }
}

/**
 * Create a new user and log them in
 * @param {Object} payload - The new user object
 * @param {string} payload.email
 * @param {string} payload.first_name
 * @param {string} payload.last_name
 * @param {string} [payload.company]
 * @param {string} [payload.website]
 * @param {string} payload.password
 * @param {string} payload.password_confirm
 */
export function* createUserAndAuthenticate({ payload }) {
  const { email, password, password_confirm, ...metadata } = payload; // eslint-disable-line camelcase, no-unused-vars

  // Attempt to create the user first
  const { error } = yield authService.signup(
    email,
    password,
    { ...metadata, name: `${metadata.first_name} ${metadata.last_name}` }
  );

  if (error) {
    yield [
      put(addError("signup", error.code, error.description)),
      put(actions.authFailure())
    ];
    return false;
  }

  // Log the new user in
  yield put(actions.authenticateUser(email, password));

  // Wait for successful authentication then push welcome notification
  const { success } = yield race({
    success: take(actions.AUTHENTICATION_SUCCESS),
    failure: take(actions.AUTHENTICATION_FAILURE)
  });

  if (success) {
    yield put(createTextNotification("Welcome to Techbikers!", 5000));
    return true;
  } else {
    yield put(createErrorNotification("Ooops, something went wrong"));
    return false;
  }
}

export function* logout() {
  yield put(createTextNotification("You have successfully logged out!"));
}

export default function* root() {
  yield [
    fork(takeEvery, INIT, checkAuthState),
    fork(takeEvery, actions.AUTHENTICATE_USER, authenticateUser),
    fork(takeEvery, actions.AUTHENTICATION_CALLBACK, authCallback),
    fork(takeEvery, actions.OAUTH_CALLBACK, oauthCallback),
    fork(takeEvery, actions.AUTHENTICATION_SUCCESS, completeAuthentication),
    fork(takeEvery, actions.BEGIN_PASSWORD_RESET, resetPassword),
    fork(takeEvery, actions.SIGNUP, createUserAndAuthenticate),
    fork(takeEvery, actions.LOGOUT, logout)
  ];
}
