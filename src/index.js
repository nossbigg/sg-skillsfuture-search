/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './app/App';
import registerServiceWorker from './app/registerServiceWorker';

const isDevEnvironment = process.env.NODE_ENV === 'development';

ReactDOM.render(
  <App isTestMode={isDevEnvironment} />,
  document.getElementById('root'),
);
registerServiceWorker();
