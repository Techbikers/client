import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import {
  getAuthenticatedUser,
  getAuthenticatedUserId
} from "auth/selectors";
import { fetchUserById } from "users/actions";
import { updateCurrentEntity } from "app/actions";
import { UserShape } from "users/shapes";

import requireAuthentication
  from "auth/containers/requireAuthentication";
import ProfileForm from "users/components/ProfileForm";
import UserRidesList from "users/containers/UserRidesList";
import Spinner from "components/Spinner";

const mapStateToProps = state => ({
  id: getAuthenticatedUserId(state),
  user: getAuthenticatedUser(state)
});

const mapDispatchToProps = {
  fetchUserById,
  updateCurrentEntity
};

const Header = styled.header`
  text-align: center;
  margin-bottom: 12px;
`;

const Content = styled.div`
  width: 550px;
  margin: auto;
`;

class Account extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    user: UserShape,
    fetchUserById: PropTypes.func.isRequired,
    updateCurrentEntity: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { id } = this.props;
    this.props.fetchUserById(id);
    this.props.updateCurrentEntity({ id });
  }

  render() {
    const { id, user } = this.props;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title="My Account – Techbikers">
        <section>
          <Content>
            <Header>
              <h1>Edit profile</h1>
            </Header>

            <ProfileForm user={user} />
          </Content>
        </section>
      </DocumentTitle>
    );
  }
}

export default requireAuthentication(connect(mapStateToProps, mapDispatchToProps)(Account))
