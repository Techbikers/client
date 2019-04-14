import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FundraiserShape } from "fundraisers/shapes";

import { RideShape } from "rides/shapes";
import { UserShape } from "users/shapes";
import { getCurrentRide } from "rides/selectors";
import { getUsersOnCurrentRide } from "users/selectors";
import { fetchUsersByRide } from "users/actions";

import Spinner from "components/Spinner";
import RidersList from "rides/components/RidersList";

import { getLeaderboard } from "fundraisers/selectors";
import { fetchActiveFundraisers } from "fundraisers/actions";

const RidersWrapper = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const mapStateToProps = state => ({
  ride: getCurrentRide(state),
  riders: getUsersOnCurrentRide(state),
  fundraisers: getLeaderboard(state)
});

const mapDispatchToProps = {
  fetchUsersByRide,
  fetchActiveFundraisers
};

class ConnectedRidersList extends Component {
  static propTypes = {
    ride: RideShape,
    riders: PropTypes.arrayOf(UserShape),
    fetchUsersByRide: PropTypes.func.isRequired,
    fundraisers: PropTypes.arrayOf(FundraiserShape),
    fetchActiveFundraisers: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchUsersByRide(this.props.ride.id);
  }

  render() {
    const { riders, fundraisers } = this.props;

    const fundraisersById = fundraisers.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    const mappedRiders = riders.slice().map(rider => {
      const fundraiserId = rider.fundraisers[rider.fundraisers.length - 1];
      rider.latestFundraiser = fundraisersById[fundraiserId];
      return rider;
    });

    mappedRiders.sort((riderA, riderB) => {
      const a = riderA.latestFundraiser;
      const b = riderB.latestFundraiser;
      return ((a ? a.totalRaised : null) < (b ? b.totalRaised : null)) ? 1 : -1;
    });

    return (
      <RidersWrapper>
        <div className="content">
          <h2>The Riders</h2>
          {mappedRiders.length === 0 ? (
            <Spinner spacing="20px" />
          ) : (
            <RidersList riders={mappedRiders} />
          )}
        </div>
      </RidersWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedRidersList)
