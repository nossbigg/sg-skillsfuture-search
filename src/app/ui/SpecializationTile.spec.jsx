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
    percentageCoveredBySkillsfuture: 0.75,
    courses: [
      { coursera: {}, skillsfuture: {} },
      { coursera: {} },
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

  describe('skillsfuture percentage', () => {
    it('should display 75% correctly', () => {
      const wrapper = mount(<SpecializationTile specialization={dummySpecialization} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('75%'));
    });

    it('should display 0% correctly', () => {
      const dummySpecializationZeroPercent =
        { ...dummySpecialization, percentageCoveredBySkillsfuture: 0 };

      const wrapper = mount(<SpecializationTile specialization={dummySpecializationZeroPercent} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('0%'));
    });

    it('should display 100% correctly', () => {
      const dummySpecializationHundredPercent =
        { ...dummySpecialization, percentageCoveredBySkillsfuture: 1 };

      const wrapper =
        mount(<SpecializationTile specialization={dummySpecializationHundredPercent} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('100%'));
    });

    it('should display 16% correctly', () => {
      const dummySpecializationZeroPercent =
        { ...dummySpecialization, percentageCoveredBySkillsfuture: 0.166666666 };

      const wrapper = mount(<SpecializationTile specialization={dummySpecializationZeroPercent} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('16%'));
    });
  });

  it('should display number of courses and number covered by skillsfuture', () => {
    const wrapper = mount(<SpecializationTile specialization={dummySpecialization} />);
    expect(wrapper.text()).toEqual(expect.stringContaining('1 / 2'));
  });
});
