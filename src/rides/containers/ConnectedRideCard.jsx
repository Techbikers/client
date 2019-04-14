import React, { Component } from "react";
import { connect } from "react-redux";

import { RideShape } from "rides/shapes";

import RideCard from "rides/components/RideCard";

const mapStateToProps = (state, props) => {
  const ride = state.entities.ride && state.entities.ride[props.rideId];
  return { ride };
};

class ConnectedRideCard extends Component {
  static propTypes = {
    ride: RideShape
  };

  render() {
    const { ride } = this.props;

    if (!ride) {
      return null;
    }

    return <RideCard {...ride} />;
  }
}

export default connect(mapStateToProps)(ConnectedRideCard)
