import React from 'react';
import { shallow } from 'enzyme';

import SpecializationTile from './SpecializationTile';

describe('#SpecializationTile', () => {
  it('should display specialization name', () => {
    const wrapper = shallow(<SpecializationTile specialization={{ name: 'spec-name' }} />);
    expect(wrapper.text()).toEqual(expect.stringContaining('spec-name'));
  });
});
