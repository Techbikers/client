import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { authCallback } from "auth/actions";

import Spinner from "components/Spinner";
import SpreadBox from "components/SpreadBox";

const mapDispatchToProps = {
  authCallback
};

class AuthComplete extends Component {
  static propTypes = {
    authCallback: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.authCallback(window.location.hash);
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

export default connect(null, mapDispatchToProps)(AuthComplete)
