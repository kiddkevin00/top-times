import meActionCreator from '../actionCreators/me';
import { showModal } from '../utils/helpers';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/pageFooter.scss';

class UnconnectedPageFooter extends Component {
  static propTypes = {
    formEmail: PropTypes.string.isRequired,

    dispatchSetFormField: PropTypes.func.isRequired,
  };

  handleSubscription = event => {
    event.preventDefault();

    if (!this.props.formEmail) {
      showModal('Email is missing!');
    } else {
      // call the backend API to subscribe to our newsletter
    }
  };

  render() {
    const { formEmail, dispatchSetFormField } = this.props;

    return (
      <footer id="pn-page-footer">
        <div className="site-map-with-get-updates">
          <div className="site-map">
            <section>
              <h4>TopTimes</h4>
              <p>2019 TopTimes, Inc.</p>
              <p>
                We currently service USA and will soon launch
                <br />
                in Canada, Latin America, and Europe
              </p>
            </section>

            <section>
              <h6>Get Started</h6>
              <p className="link" onClick={() => {}}>
                How it Works
              </p>
              <p className="link" onClick={() => {}}>
                Testimony
              </p>
            </section>

            <section>
              <h6>Support</h6>
              <p className="link" onClick={() => {}}>
                FAQ
              </p>
              <p className="link" onClick={() => {}}>
                Contact
              </p>
            </section>

            <section>
              <h6>Company</h6>
              <p className="link" onClick={() => {}}>
                Our Story
              </p>
              <p className="link" onClick={() => {}}>
                Privacy Policy
              </p>
              <p className="link" onClick={() => {}}>
                Terms of Service
              </p>
            </section>
          </div>

          <div className="get-updates">
            <form>
              <input
                placeholder="Enter your email"
                value={formEmail}
                onChange={event => dispatchSetFormField('email', event.target.value)}
              />
              <button type="submit" onClick={this.handleSubscription}>
                Get Updates
              </button>
            </form>

            <div>
              <img
                onClick={() => {}}
                className="social-media-icon"
                src="/images/facebook-icon.png"
                alt="facebook"
              />
              <img
                onClick={() => {}}
                className="social-media-icon"
                src="/images/twitter-icon.png"
                alt="twitter"
              />
              <img
                onClick={() => {}}
                className="social-media-icon"
                src="/images/instagram-icon.png"
                alt="instagram"
              />
              <img
                onClick={() => {}}
                className="social-media-icon"
                src="/images/linkedin-icon.png"
                alt="linkedin"
              />
            </div>
          </div>
        </div>

        <div className="disclaimers">
          <p>
            Disclaimer: Communications between you and TopTimes are protected by our Privacy Policy
            but not by the attorney-client privilege or as work product. TopTimes provides access to
            self-help services at your specific direction. We are not a law firm or a substitute for
            an attorney or law firm. We cannot provide any kind of advice, explanation, opinion, or
            recommendation about possible legal rights, remedies, defenses, options, selection of
            forms or strategies. Your access to the website is subject to our Terms of Service.
          </p>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = state => ({
  formEmail: state.me.form.email.value,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetFormField(field, value) {
    dispatch(meActionCreator.setFormField(field, value));
  },
});

const PageFooter = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnconnectedPageFooter));

export { UnconnectedPageFooter, PageFooter as default };
