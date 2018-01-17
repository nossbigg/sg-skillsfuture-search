import React from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

const SearchBar = ({ hintText, onSearchTermChange }) => (
  <div>
    <TextField
      hintText={hintText}
      onChange={onSearchTermChange}
    />
  </div>
);

SearchBar.propTypes = {
  hintText: PropTypes.string,
  onSearchTermChange: PropTypes.func,
};

SearchBar.defaultProps = {
  hintText: 'sample hint text',
  onSearchTermChange: () => {},
};

export default SearchBar;
