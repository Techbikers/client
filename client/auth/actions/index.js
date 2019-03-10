import { EventTypes } from "redux-segment";
import { createAction } from "redux-actions";
import { identity } from "lodash";

export const SEND_SIGNIN_LINK_TO_EMAIL = "SEND_SIGNIN_LINK_TO_EMAIL";
export const sendSignInLinkToEmail = createAction(SEND_SIGNIN_LINK_TO_EMAIL,
  (email, returnTo) => ({ email, returnTo })
);

export const WAIT_FOR_EMAIL_VERIFICATION = "WAIT_FOR_EMAIL_VERIFICATION";
export const waitForEmailVerification = createAction(WAIT_FOR_EMAIL_VERIFICATION);

export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const authSuccess = createAction(AUTHENTICATION_SUCCESS);

export const AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE";
export const authComplete = createAction(AUTHENTICATION_COMPLETE,
  identity,
  ({ userId, email, firstName, lastName }) => ({
    analytics: [
      {
        eventType: EventTypes.alias,
        eventPayload: {
          userId
        }
      },
      {
        eventType: EventTypes.identify,
        eventPayload: {
          userId,
          traits: { firstName, lastName, email }
        }
      }
    ]
  })
);

export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";
export const authFailure = createAction(AUTHENTICATION_FAILURE);

export const AUTHENTICATION_CALLBACK = "AUTHENTICATION_CALLBACK";
export const authCallback = createAction(AUTHENTICATION_CALLBACK);

export const OAUTH_CALLBACK = "OAUTH_CALLBACK";
export const oAuthCallback = createAction(OAUTH_CALLBACK,
  (code, state) => ({ code, state })
);

export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const refreshToken = createAction(REFRESH_TOKEN);

export const EXCHANGE_TOKEN = "EXCHANGE_TOKEN";
export const exchangeToken = createAction(EXCHANGE_TOKEN,
  (backend, code, state) => ({ backend, code, state })
);

export const STORE_AUTH_CALLBACK = "STORE_AUTH_CALLBACK";
export const storeAuthCallback = createAction(STORE_AUTH_CALLBACK,
  (returnTo, action) => ({ returnTo, action })
);

export const CLEAR_AUTH_CALLBACK = "CLEAR_AUTH_CALLBACK";
export const clearAuthCallback = createAction(CLEAR_AUTH_CALLBACK);

export const LOGOUT = "LOGOUT";
export const logout = createAction(LOGOUT,
  identity,
  () => ({ analytics: EventTypes.reset })
);
