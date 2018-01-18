import React from 'react';
import { shallow } from 'enzyme';

import SearchBar from './SearchBar';

describe('#searchBar', () => {
  it('passes props to input field', () => {
    const onSearchTermChangeFn = jest.fn();

    const wrapper = shallow(<SearchBar
      hintText="some-hint-text"
      onSearchTermChange={onSearchTermChangeFn}
    />);
    const textField = wrapper.find({ placeholder: 'some-hint-text' });

    expect(textField).toHaveLength(1);
    expect(textField.prop('placeholder')).toBe('some-hint-text');
    expect(textField.prop('onChange')).toBe(onSearchTermChangeFn);
  });
});
