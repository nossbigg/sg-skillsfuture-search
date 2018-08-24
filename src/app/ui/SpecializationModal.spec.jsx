import React from 'react';
import { mount } from 'enzyme';
import ReactGA from 'react-ga';

import SpecializationModal from './SpecializationModal';

describe('#SpecializationModal', () => {
  let specializationModal;
  let closeModalMock;

  const dummySpecialization = {
    name: 'spec-name',
    slug: 'some-specialization-slug',
    partnerIds: [
      { id: 1, name: 'spec-partner-1' },
      { id: 2, name: 'spec-partner-2' },
    ],
    percentageCoveredBySkillsfuture: 0.75,
    courses: [
      { coursera: { name: 'course-name-1' }, skillsfuture: {} },
      { coursera: { name: 'course-name-2' }, skillsfuture: {} },
      { coursera: { name: 'course-name-3' }, skillsfuture: {} },
      { coursera: { name: 'course-name-4' } },
    ],
  };

  beforeEach(() => {
    const googleAnalyticsProps = {
      testMode: true,
      titleCase: false,
    };
    ReactGA.initialize('random-tag', googleAnalyticsProps);

    closeModalMock = jest.fn();
    specializationModal = mount(<SpecializationModal
      specialization={dummySpecialization}
      closeModal={closeModalMock}
    />);
  });

  it('displays specialization name', () => {
    expect(specializationModal.text()).toEqual(expect.stringContaining('spec-name'));
  });

  it('displays specialization partners', () => {
    expect(specializationModal.text()).toEqual(expect.stringContaining('spec-partner-1'));
    expect(specializationModal.text()).toEqual(expect.stringContaining('spec-partner-2'));
  });

  it('displays skillsfuture coverage', () => {
    expect(specializationModal.text()).toEqual(expect.stringContaining('75%'));
  });

  it('displays courses coverage proportion', () => {
    expect(specializationModal.text()).toEqual(expect.stringContaining('3 out of 4'));
  });

  it('displays courses', () => {
    expect(specializationModal.text()).toEqual(expect.stringContaining('course-name-1'));
    expect(specializationModal.text()).toEqual(expect.stringContaining('course-name-2'));
    expect(specializationModal.text()).toEqual(expect.stringContaining('course-name-3'));
    expect(specializationModal.text()).toEqual(expect.stringContaining('course-name-4'));
  });

  it('triggers closeModal on clicking modal close button', () => {
    const closeButtonContainer = specializationModal
      .find('.closeButtonContainer')
      .first();
    closeButtonContainer.simulate('click');

    expect(closeModalMock).toBeCalled();
  });

  it('triggers closeModal on clicking outside of modal', () => {
    const shadowBackground = specializationModal
      .children()
      .children()
      .first();
    shadowBackground.simulate('click');

    expect(closeModalMock).toBeCalled();
  });
});
