import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import { fetchUserById } from "users/actions";
import { getAuthenticatedUserId } from "auth/selectors";
import { getCurrentUser, getRidesForCurrentUser } from "users/selectors";
import { UserShape } from "users/shapes";
import { yellow } from "utils/style-variables";

import Avatar from "users/components/Avatar";
import UserRidesList from "users/containers/UserRidesList";
import TwitterLink from "components/TwitterLink";
import Spinner from "components/Spinner";
import Content from "app/components/Content";

const Toolbar = styled.section`
  background: ${yellow};
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
`;

const Rides = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const RidesHeader = styled.h2`
  text-align: center;
`;

const mapStateToProps = (state, ownProps) => ({
  user: getCurrentUser(state),
  rides: getRidesForCurrentUser(state),
  canEdit: Number(ownProps.params.id) === getAuthenticatedUserId(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchUser: () => dispatch(fetchUserById(props.params.id))
});

class RiderProfile extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    user: UserShape,
    fetchUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  render() {
    const { user, canEdit } = this.props;
    const { isEditing } = this.state;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`${user.name} – Techbikers`}>
        <div id="rider-profile">
          {isEditing ?
            <Toolbar>
              <button className="btn" type="submit">Save Changes</button>
              <button className="btn">Cancel</button>
            </Toolbar> : ""}

          <section id="header">
            <header className="centerText">
              <Avatar {...user} size={130} rounded />
              <h1>{user.name}</h1>
              <h3>{user.company} |
                  {user.website} |
                <TwitterLink handle={user.twitter} /></h3>
              {canEdit ?
                <Link className="btn" to="/account">Edit Profile</Link> : ""}
            </header>

            {user.donationPage &&
              <div className="content text--centre">
                <p>
                  <a className="btn" href={user.donationPage}>Sponsor {user.firstName}</a>
                </p>
              </div>}
          </section>

          <section id="description">
            <div className="content centerText">
              <p>{user.biography}</p>

              {isEditing || user.statement !== "" ?
                <h2>Why am I doing Techbikers?</h2> : ""}

              <p>{user.statement}</p>
            </div>
          </section>

          <Rides>
            <Content>
              <RidesHeader>{user.firstName}'s rides:</RidesHeader>
              <UserRidesList userId={user.id} />
            </Content>
          </Rides>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RiderProfile)
