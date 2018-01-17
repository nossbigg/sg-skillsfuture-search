import React from 'react';
import { shallow } from 'enzyme';

import TextField from 'material-ui/TextField';
import SearchBar from './SearchBar';

describe('#searchBar', () => {
  it('passes props to TextField', () => {
    const onSearchTermChangeFn = jest.fn();

    const wrapper = shallow(<SearchBar
      hintText="some-hint-text"
      onSearchTermChange={onSearchTermChangeFn}
    />);
    const textField = wrapper.find(TextField);

    expect(textField.prop('hintText')).toBe('some-hint-text');
    expect(textField.prop('onChange')).toBe(onSearchTermChangeFn);
  });
});
