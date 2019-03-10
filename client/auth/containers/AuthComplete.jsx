import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { authCallback } from "techbikers/auth/actions";

import Spinner from "techbikers/components/Spinner";
import SpreadBox from "techbikers/components/SpreadBox";

const mapDispatchToProps = (dispatch, props) => ({
  authCallback: () => dispatch(authCallback(props.location.query.returnTo))
});

@connect(null, mapDispatchToProps)
export default class AuthComplete extends Component {
  static propTypes = {
    authCallback: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.authCallback();
  }

  render() {
    return (
      <SpreadBox>
        <Spinner>
          One moment
          <br />
          We're still thinking!
        </Spinner>
      </SpreadBox>
    );
  }
}
