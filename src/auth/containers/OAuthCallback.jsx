import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { oAuthCallback } from "auth/actions";

import Spinner from "components/Spinner";
import SpreadBox from "components/SpreadBox";

const mapDispatchToProps = (dispatch, props) => {
  const { code, state } = props.location.query;
  return {
    handleOAuthResponse: () => dispatch(oAuthCallback(code, JSON.parse(state)))
  };
};

class OAuthCallback extends Component {
  static propTypes = {
    handleOAuthResponse: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.handleOAuthResponse();
  }

  render() {
    return (
      <SpreadBox>
        <Spinner />
      </SpreadBox>
    );
  }
}

export default connect(null, mapDispatchToProps)(oAuthCallback)
