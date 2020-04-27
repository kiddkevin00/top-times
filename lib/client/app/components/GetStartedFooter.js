import H2 from './H2';
import Button from './Button';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../static/assets/styles/components/getStartedFooter.scss';

class GetStartedFooter extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  goToLogin = () => {
    this.props.history.push('/login');
  };

  render() {
    return (
      <section className="get-started-footer">
        <div>
          <H2 className="get-started-h2">
            You don't have to wrestle with timezones every single time anymore
          </H2>
          <Button className="get-started-btn" onClick={this.goToLogin}>
            LETS GET STARTED
          </Button>
        </div>
      </section>
    );
  }
}

export { GetStartedFooter as UnwrappedGetStartedFooter };
export default withRouter(GetStartedFooter);
