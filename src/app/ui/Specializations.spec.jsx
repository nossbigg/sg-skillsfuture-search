import React from 'react';
import { shallow } from 'enzyme';

import Specializations from './Specializations';
import SpecializationTile from './SpecializationTile';

describe('#Specializations', () => {
  it('should pass specializations to specializationTiles', () => {
    const specializations = [
      { id: '1', name: 'spec1' },
      { id: '2', name: 'spec2' },
    ];

    const wrapper = shallow(<Specializations specializations={specializations} />);
    expect(wrapper.find(SpecializationTile)).toHaveLength(2);
  });

  it('should render empty div when no specializations', () => {
    const wrapper = shallow(<Specializations specializations={[]} />);
    expect(wrapper.find(SpecializationTile)).toHaveLength(0);
  });
});
