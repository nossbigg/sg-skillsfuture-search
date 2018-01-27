import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import debounce from 'debounce';
import axios from 'axios';
import _ from 'lodash';
import WebFont from 'webfontloader';
import { Jumbotron, Navbar } from 'react-bootstrap';
import './App.css';
import bannerBackground from '../media/fire-1075162_1280-adjusted.jpg';

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
  const jumbotronStyle = {
    padding: '75px 10% 50px 10%',
    margin: '0',
    backgroundImage: `url(${bannerBackground})`,
    backgroundRepeat: 'none',
    backgroundSize: 'cover',
  };

  return (
    <Jumbotron style={jumbotronStyle}>
      <h1 style={{ fontFamily: 'Comfortaa, cursive', color: 'white' }}>
        Find the best way to spend your SkillsFuture credits on Coursera Specializations here.
      </h1>
      <SearchBar
        hintText="eg. Data Science"
        onSearchTermChange={event => appRef.searchTermDebouncer(event.target.value)}
      />
    </Jumbotron>
  );
};

const loadWebFont = async () => {
  WebFont.load({
    google: {
      families: ['Comfortaa:700', 'Ubuntu'],
    },
  });
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
    loadWebFont();
  }

  onSearchTermChange(searchTerm) {
    const trimmedSearchTerm = searchTerm.trim();
    this.setState({ searchTerm: trimmedSearchTerm });
  }

  searchSpecializations() {
    // eslint-disable-next-line prefer-destructuring
    let specializations = this.specializations;

    if (this.indexer) {
      specializations = this.indexer.search(this.state.searchTerm);
    }

    return _.orderBy(specializations, ['percentageCoveredBySkillsfuture'], ['desc']);
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
        <div className="myApp" style={{ fontFamily: 'Ubuntu' }}>
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
