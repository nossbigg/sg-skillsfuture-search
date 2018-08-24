import React from 'react';
import { mount } from 'enzyme';
import { Col } from 'react-bootstrap';
import ReactGA from 'react-ga';

import SpecializationTile from './SpecializationTile';

describe('#SpecializationTile', () => {
  const dummySpecialization = {
    name: 'spec-name',
    slug: 'some-slug',
    partnerIds: [
      { id: 1, name: 'spec-partner-1' },
      { id: 2, name: 'spec-partner-2' },
    ],
    percentageCoveredBySkillsfuture: 0.75,
    courses: [{ coursera: {}, skillsfuture: {} }, { coursera: {} }],
  };

  beforeEach(() => {
    const googleAnalyticsProps = {
      testMode: true,
      titleCase: false,
    };
    ReactGA.initialize('random-tag', googleAnalyticsProps);
  });

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
      const dummySpecializationZeroPercent = {
        ...dummySpecialization,
        percentageCoveredBySkillsfuture: 0,
      };

      const wrapper = mount(<SpecializationTile specialization={dummySpecializationZeroPercent} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('0%'));
    });

    it('should display 100% correctly', () => {
      const dummySpecializationHundredPercent = {
        ...dummySpecialization,
        percentageCoveredBySkillsfuture: 1,
      };

      const wrapper = mount(<SpecializationTile
        specialization={dummySpecializationHundredPercent}
      />);
      expect(wrapper.text()).toEqual(expect.stringContaining('100%'));
    });

    it('should display 16% correctly', () => {
      const dummySpecializationZeroPercent = {
        ...dummySpecialization,
        percentageCoveredBySkillsfuture: 0.166666666,
      };

      const wrapper = mount(<SpecializationTile specialization={dummySpecializationZeroPercent} />);
      expect(wrapper.text()).toEqual(expect.stringContaining('16%'));
    });

    it('should pass specialization modal information to parent', () => {
      const setSpecializationModalMock = jest.fn();

      const wrapper = mount(<SpecializationTile
        specialization={dummySpecialization}
        setSpecializationModal={setSpecializationModalMock}
      />);

      const column = wrapper
        .find(Col)
        .children()
        .children();
      column.simulate('click');

      const expectedSpecializationObject = {
        name: 'spec-name',
        slug: 'some-slug',
        partnerIds: [
          { id: 1, name: 'spec-partner-1' },
          { id: 2, name: 'spec-partner-2' },
        ],
        percentageCoveredBySkillsfuture: 0.75,
        courses: [{ coursera: {}, skillsfuture: {} }, { coursera: {} }],
      };
      expect(setSpecializationModalMock).toBeCalledWith(expectedSpecializationObject);
    });
  });
});
