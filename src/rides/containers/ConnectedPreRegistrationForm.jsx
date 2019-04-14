import { connect } from "react-redux";

import { registerUserForRide } from "rides/actions";
import { getCurrentRide } from "rides/selectors";

import PreRegistrationForm from "rides/components/PreRegistrationForm";

const mapStateToProps = state => ({
  ride: getCurrentRide(state)
});

const mapDispatchToProps = {
  registerUserForRide
};

export default connect(mapStateToProps, mapDispatchToProps)(PreRegistrationForm);
