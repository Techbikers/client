import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "techbikers/auth/containers/requireAnonymity";

const LoginPage = () => (
  <DocumentTitle title="Login – Techbikers">
    <section id="login">
      <header>
        <h1>Login</h1>
      </header>
      <div className="content">
        Please confirm your email by clicking the link
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(LoginPage);
