import { UnwrappedGetStartedFooter } from '../../../lib/client/app/components/GetStartedFooter';
import Button from '../../../lib/client/app/components/Button';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Get Started Footer component', () => {
  let props;

  beforeEach(() => {
    props = {
      history: { push: jest.fn() },
    };
  });

  it('should be rendered correctly', () => {
    const wrapper = shallow(<UnwrappedGetStartedFooter {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should always have predefined CSS classes', () => {
    const wrapper = shallow(<UnwrappedGetStartedFooter {...props}>click me</UnwrappedGetStartedFooter>);

    expect(wrapper.find('.get-started-footer').length).toBe(1);
  });

  it('navigate to Login page when clicking on action button', () => {
    const wrapper = shallow(<UnwrappedGetStartedFooter {...props}>click me</UnwrappedGetStartedFooter>);

    wrapper.find(Button).simulate('click');

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith('/login');
  });
});
