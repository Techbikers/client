import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { oAuthCallback } from "techbikers/auth/actions";

import Spinner from "techbikers/components/Spinner";
import SpreadBox from "techbikers/components/SpreadBox";

const mapDispatchToProps = (dispatch, props) => {
  const { code, state } = props.location.query;
  return {
    handleOAuthResponse: () => dispatch(oAuthCallback(code, JSON.parse(state)))
  };
};

@connect(null, mapDispatchToProps)
export default class OAuthCallback extends Component {
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
