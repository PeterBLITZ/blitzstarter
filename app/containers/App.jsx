import React from 'react';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet'

const App = (props) => {
  const mobileMeta = props.mode
    ? <Helmet meta={[{ name: 'viewport', content: 'width=device-width, initial-scale=1 maximum-scale=1.0, user-scalable=no' }]} />
    : null

  return (
    <MuiThemeProvider muiTheme={getMuiTheme({ userAgent: props.ua || 'all' })}>
      <div>
        {mobileMeta}
        {props.children}
      </div>
    </MuiThemeProvider>
  )
};

const mapStateToProps = state => ({
  ua: state.app.ua,
  mode: state.app.mode,
});

export default connect(mapStateToProps)(App);
