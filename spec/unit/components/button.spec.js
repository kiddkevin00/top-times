import Button from '../../../lib/client/app/components/Button';
import { noop } from '../../../lib/client/app/utils/constants';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

describe('Button component', () => {
  let props;

  beforeEach(() => {
    props = {
      onClick: noop,
      className: 'test-class',
    };
  });

  it('should always have predefined CSS classes', () => {
    const wrapper = shallow(<Button {...props}>click me</Button>);

    expect(wrapper.find('.pn-button').length).toBe(1);
  });

  describe('when children is not a string', () => {
    it('should be rendered correctly', () => {
      const wrapper = shallow(<Button {...props}><span>click me</span></Button>);

      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('triggers `onClick` handler when clicking', () => {
      props.children = <span>click me</span>;
      props.onClick = jest.fn();
      const wrapper = shallow(<Button {...props} />);

      wrapper.find('button').simulate('click');

      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when children is a string', () => {
    it('should be rendered correctly', () => {
      const wrapper = shallow(<Button {...props}>click me</Button>);

      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should match the same string with the native `button` DOM element', () => {
      const buttonText = 'click me';

      props.children = buttonText;
      const wrapper = shallow(<Button {...props} />);

      expect(wrapper.find('button').props().children).toBe(buttonText);
    });

    it('should have `onClick()` handler passed into native `button` DOM element', () => {
      props.children = 'click me';
      props.onClick = () => {};
      const wrapper = shallow(<Button {...props} />);

      expect(wrapper.find('button').props().onClick).toBe(props.onClick);
    });
  });
});
