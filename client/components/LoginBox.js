import React, { Component } from 'react'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'

const styles = {
  title: {
    margin: '13px'
  },
  social: {
    padding: '20px'
  },
}

class LoginBox extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      email: '',
      pass: ''
    }
  }

  handleChEmail = e => {
    this.setState({ email: e.target.value });
  }
  handleChPass = e => {
    this.setState({ pass: e.target.value });
  }

  onAddPostBtnClick = () => {
    setTimeout(()=>{
      if (this.state.email && this.state.pass) {
        this.props.SoL(this.state.email, this.state.pass);
        this.setState({ email: '', pass: '' })
      }
    }, 0);
  }

  render() {
    return (
      <Paper>
        <form>
          <TextField
            hintText='email'
            value={this.state.email}
            onChange={this.handleChEmail}
          />
          <TextField
            hintText='password'
            type='password'
            value={this.state.pass}
            onChange={this.handleChPass}
          />
          <RaisedButton
            label='Signup or Login'
            primary={true}
            onTouchTap = { this.onAddPostBtnClick }
          />
        </form>
        <Divider />
        <div style={styles.social}>
          <RaisedButton
            label='Facebook'
            linkButton={true}
            href='/auth/facebook'
            secondary={true}
          />
          <span style={styles.title}>Signup or Login with Facebook</span>
        </div>
      </Paper>
    )
  }
}

export default LoginBox
