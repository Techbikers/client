import React from "react";
import DocumentTitle from "react-document-title";

import requireAnonymity from "auth/containers/requireAnonymity";
import LoginForm from "auth/containers/LoginForm";
import Errors from "errors/containers/Errors";

const LoginPage = () => (
  <DocumentTitle title="Login – Techbikers">
    <section id="login">
      <header>
        <h1>Login</h1>
      </header>
      <div className="content">
        <Errors errorKey="authentication" />
        <LoginForm />
      </div>
    </section>
  </DocumentTitle>
);

export default requireAnonymity()(LoginPage);
