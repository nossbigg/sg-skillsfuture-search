import React from 'react';
import { mount } from 'enzyme';

import SpecializationTile from './SpecializationTile';

describe('#SpecializationTile', () => {
  it('should display specialization name', () => {
    const wrapper = mount(<SpecializationTile specialization={{ name: 'spec-name' }} />);
    expect(wrapper.text()).toEqual(expect.stringContaining('spec-name'));
  });
});
