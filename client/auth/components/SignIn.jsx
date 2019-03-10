import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "techbikers/auth/containers/requireAnonymity";
import EmailSignIn from "techbikers/auth/containers/EmailSignIn";
import Errors from "techbikers/errors/containers/Errors";

const LoginPage = () => (
  <DocumentTitle title="Login – Techbikers">
    <section>
      <header>
        <h1>Sign In</h1>
      </header>
      <div className="content">
        <Errors errorKey="authentication" />
        <EmailSignIn />
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(LoginPage);
