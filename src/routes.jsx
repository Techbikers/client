import React from "react";
import { Route, IndexRoute } from "react-router";

// Base App
import AppContainer from "app/containers/AppContainer";
import Home from "app/components/pages/Home";
import About from "app/components/pages/About";
import Charity from "app/components/pages/Charity";
import NotFound from "app/components/pages/NotFound";

// Chapters
import ChapterDetails from "chapters/containers/ChapterDetails";

// Rides
import Rides from "rides/containers/Rides";
import RideDetails from "rides/containers/RideDetails";

// Auth
import AuthComplete from "auth/containers/AuthComplete";
import OAuthCallback from "auth/containers/OAuthCallback";
import Signup from "auth/components/Signup";
import Login from "auth/components/Login";
import PasswordReset from "auth/containers/PasswordReset";

// Users
import Account from "users/containers/Account";
import Profile from "users/containers/Profile";

// Fundraising
import Leaderboard from "fundraisers/containers/Leaderboard";

export default (
  <Route>
    // # Auth Response Handler
    <Route path="/auth/complete" component={AuthComplete} />
    <Route path="/oauth/callback" component={OAuthCallback} />

    // # Main App handler
    <Route path="/" component={AppContainer}>
      // ## Core Pages
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="the_charity" component={Charity} />

      // ## Authentication and Account
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="account" component={Account} />
      <Route path="password/reset" component={PasswordReset} />

      // ## Ride Routing
      <Route path="rides">
        <IndexRoute component={Rides} />
        <Route path=":id(/:slug)" component={RideDetails} />
      </Route>

      // ## Rider Routing
      <Route path="riders/:id" component={Profile} />

      // ## Fundraising
      <Route path="donate" component={Leaderboard} />

      // ## Chapter Routing
      <Route path="chapters">
        <Route path=":name" component={ChapterDetails} />
      </Route>

      // ## Error handling
      <Route path="*" component={NotFound}/>
    </Route>
  </Route>
);
