import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';

import debounce from 'debounce';
import './App.css';
import SearchBar from './ui/SearchBar';

const DEBOUNCE_TIME = 200;

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: 'no search term',
    };
    this.searchTermDebouncer =
      debounce((event, searchTerm) => this.onSearchTermChange(searchTerm), DEBOUNCE_TIME);
  }

  onSearchTermChange(searchTerm) {
    const trimmedSearchTerm = searchTerm.trim();
    this.setState({ searchTerm: trimmedSearchTerm });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div>
            Search Term: { this.state.searchTerm }
          </div>
          <SearchBar
            hintText="someHintText"
            onSearchTermChange={this.searchTermDebouncer}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
