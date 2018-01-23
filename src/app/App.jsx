import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';

import debounce from 'debounce';
import axios from 'axios';

import { Jumbotron, Navbar } from 'react-bootstrap';
import './App.css';

import Search from './helper/search';
import SearchBar from './ui/SearchBar';
import Specializations from './ui/Specializations';

const DEBOUNCE_TIME = 200;

const renderNavigationBar = () => {
  const navBarStyle = {
    backgroundImage: 'none',
    backgroundColor: 'rgba(0,0,0,0)',
    marginBottom: '-50px',
    border: 0,
    boxShadow: 'none',
  };
  return (
    <Navbar style={navBarStyle} />
  );
};

const renderBannerAndSearchBar = (appRef) => {
  const gridStyle = {
    padding: '100px 10% 100px 10%',
  };

  return (
    <Jumbotron style={gridStyle}>
      <h1>
        Find the best way to spend your SkillsFuture credits on Coursera Specializations here.
      </h1>
      <SearchBar
        hintText="someHintText"
        onSearchTermChange={event => appRef.searchTermDebouncer(event.target.value)}
      />
    </Jumbotron>
  );
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      searchTerm: '',
    };

    this.indexer = null;
    this.specializations = [];

    this.searchTermDebouncer =
      debounce(searchTerm => this.onSearchTermChange(searchTerm), DEBOUNCE_TIME);
  }

  componentDidMount() {
    this.doLoadData();
  }

  onSearchTermChange(searchTerm) {
    const trimmedSearchTerm = searchTerm.trim();
    this.setState({ searchTerm: trimmedSearchTerm });
  }

  searchSpecializations() {
    if (!this.indexer) {
      return this.specializations;
    }
    return this.indexer.search(this.state.searchTerm);
  }

  async doLoadData() {
    const dataStore = await axios.get(`${process.env.PUBLIC_URL}/data/mergedStore.json`);

    this.specializations = dataStore.data.specializations;
    this.indexer = new Search(this.specializations);

    this.setState(prevState => prevState);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="myApp">
          {renderNavigationBar()}
          <main>
            {renderBannerAndSearchBar(this)}
            <Specializations specializations={this.searchSpecializations()} />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
