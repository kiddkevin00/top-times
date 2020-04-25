import PageFooter from './PageFooter';
import GetStartedFooter from '../components/GetStartedFooter';
import H2 from '../components/H2';
import Button from '../components/Button';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/home.scss';

export default class Home extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  goToLogin = () => {
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="home">
        <header className="get-started-header">
          <p className="headline">Never warp your brain with time zone math again</p>

          <p>Time zones are a nightmare. Remote work doesn’t have to be.</p>
          <p>
            Spare yourself all the frustration, double-checking, adding and subtracting… and get
            your whole team on the same page.
          </p>
          <Button className="lets-get-started-button" onClick={this.goToLogin}>
            LETS GET STARTED
          </Button>
        </header>

        <img className="hero-image" src="/images/time-zone-math.jpg" alt="omg" />

        <section className="image-description">
          <H2>Know when your team is, at all times</H2>
          <p>
            That intuitive, confident sense of time you get from working in a physical office where
            everyone pools at the coffee machine in the morning, then gathers in the break room
            around quitting time? That feeling of temporal certainty? Gone! Google can’t give you
            that. But you can get that feeling back with TopTimezones.
          </p>
        </section>

        <GetStartedFooter />
        <PageFooter />
      </div>
    );
  }
}
