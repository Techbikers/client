import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { fetchRideById } from 'techbikers/rides/actions'

import FundraisingTotal from 'techbikers/fundraisers/components/FundraisingTotal'

const mapStateToProps = (state, props) => ({
  ride: state.entities.ride && state.entities.ride[props.location.query.ride]
})

const mapDispatchToProps = (dispatch, props) => ({
  fetchRide: () => dispatch(fetchRideById(props.location.query.ride))
})

class FundraisingTotalWidget extends Component {
  componentWillMount() {
    this.props.fetchRide()
  }

  render() {
    const rideId = this.props.location.query.ride

    if (!rideId) {
      return (
        <div>You need to provide a ride ID.</div>
      )
    }

    if (!this.props.ride) {
      return (
        <div>No ride with the ID {rideId} exists</div>
      )
    }

    const { fundraisingTotal, currency } = this.props.ride

    return (
      <IntlProvider locale="en">
        <FundraisingTotal currency={currency} total={fundraisingTotal} />
      </IntlProvider>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundraisingTotalWidget)
