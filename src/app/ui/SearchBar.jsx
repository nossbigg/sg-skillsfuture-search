import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class SearchBar extends React.Component {
  shouldComponentUpdate() {
    // prevents overwriting of search bar upon state update
    return false;
  }

  render() {
    const SearchBarContainer = styled.div`
    margin-top: 20px;
    background-color: rgba(255,255,255,0.75);
    padding: 5px 10px;
    border-radius: 30px;
    overflow: hidden;
    width: 75%;
    min-width: 300px;
  `;

    const SearchBarField = styled.input`
    width: 100%;
    height:30px;
    font-size: 20px;
    background-color: rgba(0,0,0,0);
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    margin-left: 3px;
    outline: none;
    border: none;
  `;

    return (
      <SearchBarContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className="material-icons">search</i>
          <SearchBarField
            placeholder={this.props.hintText}
            onChange={this.props.onSearchTermChange}
          />
        </div>
      </SearchBarContainer>
    );
  }
}

SearchBar.propTypes = {
  hintText: PropTypes.string,
  onSearchTermChange: PropTypes.func,
};

SearchBar.defaultProps = {
  hintText: 'sample hint text',
  onSearchTermChange: () => {},
};

export default SearchBar;
