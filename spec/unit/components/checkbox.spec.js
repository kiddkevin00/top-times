import CheckboxInput from '../../../lib/client/app/components/CheckboxInput';
import { shallow, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

describe('Checkbox Input component', () => {
  describe('when first mounts', () => {
    it('should be rendered correctly', () => {
      const wrapper = shallow(
        <CheckboxInput className="test-class" onChange={() => {}} value={false}>
          This checkbox is for testing
        </CheckboxInput>
      );

      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should always have predefined CSS classes', () => {
      const wrapper = shallow(
        <CheckboxInput className="test-class" onChange={() => {}} value={false}>
          This checkbox is for testing
        </CheckboxInput>
      );

      expect(wrapper.find('.pn-checkbox').length).toBe(1);
    });

    it('should have the correct text rendered', () => {
      const text = 'Click here to agree our terms and services';
      const wrapper = render(
        <CheckboxInput onChange={() => {}} value={false}>
          {text}
        </CheckboxInput>
      );

      expect(wrapper.find('p').text()).toBe(text);
    });
  });

  it('should toggle the checked state when clicking', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CheckboxInput onChange={onChange} value={false}>
        This checkbox is for testing
      </CheckboxInput>
    );

    wrapper.simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should toggle the checked state when pressing enter', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <CheckboxInput onChange={onChange} value={false}>
        This checkbox is for testing
      </CheckboxInput>
    );

    wrapper.simulate('keypress', { key: 'Enter' });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should not toggle the checked state when pressing other keys', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <CheckboxInput onChange={onChange} value={false}>
        This checkbox is for testing
      </CheckboxInput>
    );

    wrapper.simulate('keypress', { key: 'E' });

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
