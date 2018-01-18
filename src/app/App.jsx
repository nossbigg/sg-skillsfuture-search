import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';

import debounce from 'debounce';
import axios from 'axios';

import './App.css';
import SearchBar from './ui/SearchBar';
import Specializations from './ui/Specializations';

const DEBOUNCE_TIME = 200;

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: 'no search term',
      dataStore: {},
    };
    this.searchTermDebouncer =
      debounce((event, searchTerm) => this.onSearchTermChange(searchTerm), DEBOUNCE_TIME);
  }

  componentDidMount() {
    this.doLoadData();
  }

  onSearchTermChange(searchTerm) {
    const trimmedSearchTerm = searchTerm.trim();
    this.setState({ searchTerm: trimmedSearchTerm });
  }

  async doLoadData() {
    const dataStore = await axios.get(`${process.env.PUBLIC_URL}/data/mergedStore.json`);
    this.setState({ dataStore: dataStore.data });
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
          <Specializations specializations={this.state.dataStore.specializations} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
