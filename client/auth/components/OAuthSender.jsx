import React, { PropTypes } from "react";
import qs from "qs";

import { OAUTH_REDIRECT_URI } from "techbikers/config";

const buildAuthURL = (url, params) => {
  if (params === null) {
    return url;
  }

  const serializedParams = qs.stringify(params);
  if (!serializedParams) {
    return url;
  }

  return `${url}${url.indexOf("?") < 0 ? "?" : "&"}${serializedParams}`;
};

const OAuthSender = ({
  authorizeUrl,
  clientId,
  scope,
  nonce,
  state,
  callback,
  children
}) => {
  const url = buildAuthURL(`${authorizeUrl}`, {
    /* eslint-disable camelcase */
    client_id: clientId,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: "code",
    /* eslint-enable */
    nonce,
    scope,
    state: JSON.stringify({
      callback,
      ...state
    })
  });

  if (children !== null) {
    return children({ url });
  }

  return null;
};

OAuthSender.propTypes = {
  redirectUri: PropTypes.string,
  callback: PropTypes.shape({
    type: PropTypes.string,
    payload: PropTypes.any
  }),
  children: PropTypes.func.isRequired
};

export default OAuthSender;
