import React from 'react';
import ReactDOM from 'react-dom';
import Application from './components/Application';
import * as Sentry from '@sentry/browser';

Sentry.init({dsn: "https://fb0db49331d1408faf8d659b5eba5303@sentry.io/1792794"});

window.onbeforeunload = function( e ) {
  e.preventDefault();
  e.returnValue = '';
}

ReactDOM.render(<Application />, document.getElementById('app'));