import React from 'react';
import { shallow } from 'enzyme';

import Specializations from './Specializations';
import SpecializationTile from './SpecializationTile';

describe('#Specializations', () => {
  const generateSpecialization = () => ({ id: '1', name: 'spec1' });

  const twentySpecializations = new Array(20).fill(generateSpecialization());
  const twentyoneSpecializations = new Array(21).fill(generateSpecialization());
  const fortyoneSpecializations = new Array(41).fill(generateSpecialization());

  it('should pass specializations to specializationTiles', () => {
    const specializations = [
      { id: '1', name: 'spec1' },
      { id: '2', name: 'spec2' },
    ];

    const wrapper = shallow(<Specializations specializations={specializations} />);
    expect(wrapper.find(SpecializationTile).exists()).toEqual(true);

    const specializationTile = wrapper.find(SpecializationTile).first();
    expect(specializationTile.props().specialization).toEqual({ id: '1', name: 'spec1' });
  });

  it('should render empty div when no specializations', () => {
    const wrapper = shallow(<Specializations specializations={[]} />);
    expect(wrapper.find(SpecializationTile)).toHaveLength(0);
  });

  describe('showMoreButton and showAllButton', () => {
    it('given 20 specializations, ' +
      'should render 20 specializations and not render show more/show all button', () => {
      const wrapper = shallow(<Specializations specializations={twentySpecializations} />);
      expect(wrapper.find(SpecializationTile)).toHaveLength(20);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(false);
      expect(wrapper.find('.showAllButton').exists()).toEqual(false);
    });

    it('given 21 specializations, ' +
      'should render 20 specializations and render show more/show all button', () => {
      const wrapper = shallow(<Specializations specializations={twentyoneSpecializations} />);
      expect(wrapper.find(SpecializationTile)).toHaveLength(20);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(true);
      expect(wrapper.find('.showAllButton').exists()).toEqual(true);
    });

    it('given 21 specializations and clicked show more button, ' +
      'should render 21 specializations and not render show more/show all button', () => {
      const wrapper = shallow(<Specializations specializations={twentyoneSpecializations} />);

      wrapper.find('.showMoreButton').simulate('click');

      expect(wrapper.find(SpecializationTile)).toHaveLength(21);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(false);
      expect(wrapper.find('.showAllButton').exists()).toEqual(false);
    });

    it('given 41 specializations and clicking show more button, ' +
      'should render correct amount of specializations as button gets clicked', () => {
      const wrapper = shallow(<Specializations specializations={fortyoneSpecializations} />);
      expect(wrapper.find(SpecializationTile)).toHaveLength(20);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(true);
      expect(wrapper.find('.showAllButton').exists()).toEqual(true);

      wrapper.find('.showMoreButton').simulate('click');
      expect(wrapper.find(SpecializationTile)).toHaveLength(40);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(true);
      expect(wrapper.find('.showAllButton').exists()).toEqual(true);

      wrapper.find('.showMoreButton').simulate('click');
      expect(wrapper.find(SpecializationTile)).toHaveLength(41);
      expect(wrapper.find('.showMoreButton').exists()).toEqual(false);
      expect(wrapper.find('.showAllButton').exists()).toEqual(false);
    });
  });
});
