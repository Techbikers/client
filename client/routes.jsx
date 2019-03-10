import React from "react";
import { Route, IndexRoute } from "react-router";

// Base App
import AppContainer from "techbikers/app/containers/AppContainer";
import Home from "techbikers/app/components/pages/Home";
import About from "techbikers/app/components/pages/About";
import Charity from "techbikers/app/components/pages/Charity";
import NotFound from "techbikers/app/components/pages/NotFound";

// Chapters
import ChapterDetails from "techbikers/chapters/containers/ChapterDetails";

// Rides
import Rides from "techbikers/rides/containers/Rides";
import RideDetails from "techbikers/rides/containers/RideDetails";
import RidersListWidget from "techbikers/rides/containers/RidersListWidget";

// Auth
import AuthComplete from "techbikers/auth/containers/AuthComplete";
import OAuthCallback from "techbikers/auth/containers/OAuthCallback";
import SignIn from "techbikers/auth/components/SignIn";
import ConfirmEmail from "techbikers/auth/components/ConfirmEmail";

// Users
import Account from "techbikers/users/containers/Account";
import Profile from "techbikers/users/containers/Profile";

// Fundraising
import Leaderboard from "techbikers/fundraisers/containers/Leaderboard";
import FundraisingTotalWidget from "techbikers/fundraisers/containers/FundraisingTotalWidget";

// Embedable Widgets
import EmbeddableWidget from "techbikers/components/EmbeddableWidget";

export default (
  <Route>
    // # Auth Response Handler
    <Route path="/signin/complete" component={AuthComplete} />
    <Route path="/oauth/callback" component={OAuthCallback} />

    // # Embeddable Widgets
    <Route path="/embed/" component={EmbeddableWidget} >
      <Route path="fundraising-total" component={FundraisingTotalWidget} />
      <Route path="riders-list" component={RidersListWidget} />
    </Route>

    // # Main App handler
    <Route path="/" component={AppContainer}>
      // ## Core Pages
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="the_charity" component={Charity} />

      // ## Authentication and Account
      <Route path="signin" component={SignIn} />
      <Route path="signin/confirm" component={ConfirmEmail} />
      <Route path="account" component={Account} />

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
