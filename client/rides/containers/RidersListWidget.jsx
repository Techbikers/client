import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { fetchUsersByRide } from 'techbikers/users/actions'

import RidersList from 'techbikers/rides/components/RidersList'

const Wrapper = styled.div`
  width: 800px;
  margin: 0 auto;
`

const mapStateToProps = (state, props) => {
  let riders = []

  if (state.entities.user) {
    riders = Object.values(state.entities.user).filter(
      user => user.rides.includes(parseInt(props.location.query.ride))
    )
  }

  return { riders }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchRiders: () => dispatch(fetchUsersByRide(props.location.query.ride))
})

class RidersListWidget extends Component {

  componentWillMount() {
    this.props.fetchRiders()
  }

  render() {
    const rideId = this.props.location.query.ride

    if (!rideId) {
      return (
        <div>You need to provide a ride ID.</div>
      )
    }

    if (!this.props.riders) {
      return (
        <div>No ride with the ID {rideId} exists</div>
      )
    }

    return (
      <Wrapper>
        <RidersList riders={this.props.riders} />
      </Wrapper>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RidersListWidget)
