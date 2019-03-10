import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import forms, { Form } from "newforms";

import { sendSignInLinkToEmail } from "techbikers/auth/actions";

import Button from "techbikers/components/Button";
import FormField from "techbikers/components/FormField";

/* eslint-disable babel/new-cap */
const LoginFormSchema = Form.extend({
  email: forms.EmailField()
});
/* eslint-enable */

const mapStateToProps = state => ({
  loading: state.auth.state === "loading"
});

const mapDispatchToProps = {
  sendSignInLinkToEmail
};

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    sendSignInLinkToEmail: PropTypes.func.isRequired
  };

  constructor(options) {
    super(options);
    this.state = {
      form: new LoginFormSchema({ onChange: this.onFormChange })
    };
  }

  onFormChange = () => this.forceUpdate()

  handleLogin = event => {
    event.preventDefault();

    const { form } = this.state;

    if (form.validate()) {
      const { email } = form.cleanedData;
      this.props.sendSignInLinkToEmail(email);
    }
  }

  render() {
    const { loading } = this.props;
    const fields = this.state.form.boundFieldsObj();

    return (
      <form id="loginform" role="form" onSubmit={this.handleLogin}>
        <div className="row">
          {Object.keys(fields).map(key =>
            <FormField key={fields[key].htmlName} field={fields[key]} className="span2 offset2" />
          )}
        </div>
        <div className="row centerText">
          <div className="span6">
            <Button loading={loading} type="submit">Sign In</Button>
          </div>
        </div>
      </form>
    );
  }
}
