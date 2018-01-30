import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import debounce from 'debounce';
import axios from 'axios';
import _ from 'lodash';
import WebFont from 'webfontloader';
import { Jumbotron, Navbar } from 'react-bootstrap';
import moment from 'moment';
import ReactGA from 'react-ga';

import './App.css';
import bannerBackground from '../media/fire-1075162_1280-adjusted.jpg';
import Search from './helper/search';
import SearchBar from './ui/SearchBar';
import Specializations from './ui/Specializations';

const DEBOUNCE_TIME = 200;
const GOOGLE_ANALYTICS_TAG = 'UA-113184985-1';

const renderNavigationBar = () => {
  const navBarStyle = {
    backgroundImage: 'none',
    backgroundColor: 'rgba(0,0,0,0)',
    height: '75px',
    marginBottom: '-75px',
    border: 0,
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
  };

  const textStyle = {
    color: 'white',
  };

  return (
    <Navbar style={navBarStyle}>
      <Navbar.Header>
        <Navbar.Brand>
          <span style={textStyle} >Coursera-SkillsFuture Specialization Search</span>
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
  );
};

const renderFooter = (informationScrapeTimestamp) => {
  const footerStyle = {
    backgroundImage: `url(${bannerBackground})`,
    backgroundPosition: 'bottom',
    color: 'white',
    fontFamily: 'Ubuntu',
    textAlign: 'center',
    margin: '0',
  };

  const timestampToBeDisplayed = informationScrapeTimestamp
    ? moment(informationScrapeTimestamp).format('DD MMM YYYY')
    : '?';

  return (
    <Jumbotron style={footerStyle}>
      <div style={{ margin: '5px' }}>
        <span className="informationScrapeTimestamp">
          Information accurate as of {timestampToBeDisplayed}
        </span>
      </div>
      <div style={{ margin: '5px' }}>
        <span>
        All course information and copyrights belong to their respective owners,
         including <a href="https://www.coursera.org/">Coursera</a> and <a href="http://www.skillsfuture.sg/">Skillsfuture SG</a>
        </span>
      </div>
      <div>
        <span role="img" aria-label="Heart">
          built with ❤️ by nossbigg | repo: <a href="https://github.com/nossbigg/sg-skillsfuture-search">here</a>
        </span>
      </div>
    </Jumbotron>
  );
};


const renderBannerAndSearchBar = (appRef) => {
  const jumbotronStyle = {
    padding: '100px 10% 50px 10%',
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

const initializeGoogleAnalytics = (isTestMode) => {
  const googleAnalyticsProps = {
    testMode: isTestMode,
    titleCase: false,
  };

  ReactGA.initialize(GOOGLE_ANALYTICS_TAG, googleAnalyticsProps);
};

const trackSearchQuery = async (searchQuery) => {
  if (searchQuery.length === 0) {
    return;
  }

  ReactGA.event({
    category: 'User',
    action: 'Search Query',
    label: searchQuery,
  });
};


class App extends Component {
  constructor({ isTestMode }) {
    super();
    this.isTestMode = !isTestMode ? false : isTestMode;

    this.state = {
      searchTerm: '',
    };

    this.indexer = null;
    this.specializations = [];
    this.informationScrapeTimestamp = null;

    this.searchTermDebouncer =
      debounce(searchTerm => this.onSearchTermChange(searchTerm), DEBOUNCE_TIME);
  }

  componentDidMount() {
    initializeGoogleAnalytics(this.isTestMode);

    ReactGA.pageview('/');
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
      trackSearchQuery(this.state.searchTerm);
    }

    return _.orderBy(specializations, ['percentageCoveredBySkillsfuture'], ['desc']);
  }

  async doLoadData() {
    const dataStore = await axios.get(`${process.env.PUBLIC_URL}/data/mergedStore.json`);

    this.specializations = dataStore.data.specializations;
    this.indexer = new Search(this.specializations);

    this.informationScrapeTimestamp = dataStore.data.informationScrapeTimestamp;

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
          {renderFooter(this.informationScrapeTimestamp)}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
