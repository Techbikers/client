import React, { PropTypes } from "react";
import { connect } from "react-redux";

import { JUSTGIVING_AUTH_URL, JUSTGIVING_CLIENT_ID } from "config";
import { getCurrentEntity } from "app/selectors";
import { getAuthenticatedUserId } from "auth/selectors";
import { FundraiserShape } from "fundraisers/shapes";
import { CREATE_FUNDRAISER } from "fundraisers/actions";
import { getFundraiserForCurrentRideAndUser } from "fundraisers/selectors";

import OAuthSender from "auth/components/OAuthSender";

const mapStateToProps = state => {
  const rideId = getCurrentEntity(state)["id"];
  const userId = getAuthenticatedUserId(state);

  return {
    fundraiser: getFundraiserForCurrentRideAndUser(state),
    // This is the action that we want to fire as the auth callback
    callback: {
      type: CREATE_FUNDRAISER,
      payload: { rideId, userId }
    }
  };
};

const SetupFundraising = ({ fundraiser, callback }) => {
  if (fundraiser) {
    return (
      <a className="btn btn-blue" href={fundraiser.pageUrl}>
        Go to my fundraising page
      </a>
    );
  } else {
    return (
      <OAuthSender
        authorizeUrl={JUSTGIVING_AUTH_URL}
        clientId={JUSTGIVING_CLIENT_ID}
        scope="openid email profile account fundraise offline_access"
        callback={callback}
      >
        {({ url }) =>
          <a className="btn btn-green" href={url}>Create Fundraising Page</a>
        }
      </OAuthSender>
    );
  }
};

SetupFundraising.propTypes = {
  fundraiser: FundraiserShape,
  callback: PropTypes.shape({
    type: PropTypes.string,
    payload: PropTypes.shape({
      rideId: PropTypes.number,
      userId: PropTypes.number
    })
  })
};

export default connect(mapStateToProps)(SetupFundraising);
