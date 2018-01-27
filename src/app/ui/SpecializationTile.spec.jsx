import React from 'react';
import { mount } from 'enzyme';

import SpecializationTile from './SpecializationTile';

describe('#SpecializationTile', () => {
  const dummySpecialization = {
    name: 'spec-name',
    partnerIds: [
      { id: 1, name: 'spec-partner-1' },
      { id: 2, name: 'spec-partner-2' },
    ],
  };

  it('should display specialization name', () => {
    const wrapper = mount(<SpecializationTile specialization={dummySpecialization} />);
    expect(wrapper.text()).toEqual(expect.stringContaining('spec-name'));
  });

  it('should display specialization partner', () => {
    const wrapper = mount(<SpecializationTile specialization={dummySpecialization} />);
    expect(wrapper.text()).toEqual(expect.stringContaining('spec-partner-1'));
    expect(wrapper.text()).toEqual(expect.stringContaining('spec-partner-2'));
  });
});
