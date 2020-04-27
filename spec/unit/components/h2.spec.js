import H2 from '../../../lib/client/app/components/H2';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Header 2 component', () => {
  let props;

  beforeEach(() => {
    props = {
      className: 'test-class',
      children: 'This is a header 2',
    };
  });

  it('should be rendered correctly', () => {
    const wrapper = shallow(<H2 {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should always have predefined CSS classes', () => {
    const wrapper = shallow(<H2 {...props}>click me</H2>);

    expect(wrapper.find('.pn-h2').length).toBe(1);
  });
});
