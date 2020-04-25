import routes from '../../lib/client/app/routes';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('Routes element', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(routes);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
