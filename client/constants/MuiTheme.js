import getMuiTheme from 'material-ui/styles/getMuiTheme'

function muiTheme(req) {
  if (__DEVSERVER__ && req) {
    global.navigator = global.navigator || {}
    global.navigator.userAgent = req.headers['user-agent'] || 'all'
  }
  return getMuiTheme()
}

export default muiTheme
