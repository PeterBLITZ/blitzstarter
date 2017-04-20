import React, { Component } from 'react';
import listensToClickOutside from 'react-onclickoutside';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { grey500 } from 'material-ui/styles/colors';

const styles = {
  addPostWrap: {
    marginBottom: '11px'
  },
  mainAddWrap: {
    display: 'table',
  },
  addPhotos: {
    display: 'table-cell',
    marginLeft: '2px',
  },
  addMainInputWrap: {
    display: 'table-cell',
    width: '100%',
  },
  addMainInputWrapInner: {
    position: 'relative',
    width: '100%',
  },
  addMainInput: {
    position: 'absolute',
    width: '100%',
    marginTop: '2px',
  },
  wishBtn: {
    marginTop: '6px',
    marginRight: '10px',
  },
  rightWrap: {
    display: 'table-cell',
    width: '100%',
  },
  right: {
    display: 'table',
    width: '100%'
  },
  showAddedImages: {
    padding: '20px 0px 20px 20px',
  },
  imageInput: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '0px',
    height: '0px',
    opacity: 0
  },
  addDescrInputWrap: {
    padding: '0 20px',
    paddingBottom: '10px'
  },
  addDescrInput: {
    width: '100%',
  },
  hid: {
    display: 'none'
  }
}

class AddPost extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      focused: false,
      name: '',
      descr: '',
      images: ''
    }
  }

  handleKeyPress = e => {
    if (e.key === 'Enter' || (e.shiftKey && e.key === 'Enter')) {
      this.onAddPostBtnClick()
    }
  }

  handleKeyPressDescr = e => {
    if (e.shiftKey && e.key === 'Enter') {
      this.onAddPostBtnClick()
    }
  }

  handleChangeName = e => {
    this.onAddPostFocus();
    let name = e.target.value;
    this.setState({ name: name });
  }

  handleChangeDescr = e => {
    let descr = e.target.value;
    this.setState({ descr: descr });
  }

  onAddPostFocus() {
    if (!this.props.focused) {
      this.props.onAddPostFocused(true);
    }
  }

  handleClickOutside = () => {
    if (this.props.focused) {
        this.props.onAddPostFocused(false);
        this.refs.mainInput.blur();
    }
  }

  handleChange(event) {
    console.log(event.target.files);
    this.setState({images: event.target.files});
  }

  onAddFilesTap(){
    if (!this.props.focused) {
      this.props.onAddPostFocused(true);
    }
    this.refs._postImages.click();
  }

  onAddPostBtnClick = () => {
    setTimeout(()=>{
      if (this.state.name || this.state.images || this.state.descr) {
        this.props.addPost(this.state.name, this.state.images, this.state.descr);
        this.setState({ focused: false, name: '', descr:'', images: '' }, () => {
          this.props.onAddPostFocused(false);
          this.refs.mainInput.blur();
        });
      }
    }, 0);
  }

  render() {
    const { focused } = this.props
    let showAddedImages
    if ( this.state.images && this.state.images.length ) {
      showAddedImages =
        <div style={styles.showAddedImages}>
          { Array.prototype.map.call( this.state.images, (image, i) => <div key={i+image.name}>{image.name}</div> ) }
        </div>
    }

    return (
      <Paper zDepth={1}>
        <form style={styles.addPostWrap} >
        <input style={styles.hid} />

          <div style={styles.mainAddWrap}>
            <input
              tabIndex={-1}
              type='file'
              accept='image/jpeg, image/png'
              multiple='multiple'
              ref='_postImages'
              style={styles.imageInput}
              onChange={::this.handleChange}
            />
            <IconButton
              tabIndex={2}
              style={styles.addPhotos}
              tooltip='Add photos'
              onTouchTap={::this.onAddFilesTap}
            >
              <FontIcon className='material-icons' color={grey500}>add_a_photo</FontIcon>
            </IconButton>

            <div style={styles.rightWrap} className='clearfix'>
              <div style={styles.right}>
                <div style={styles.addMainInputWrap}>
                  <div style={styles.addMainInputWrapInner}>
                    <TextField
                      tabIndex={1}
                      style={styles.addMainInput}
                      hintText= 'Add news title, photos or URL'
                      value={this.state.name}
                      onChange={this.handleChangeName}
                      onFocus={::this.onAddPostFocus}
                      ref='mainInput'
                      onKeyDown={this.handleKeyPress}
                      underlineShow={false}
                    />
                  </div>
                </div>
                <RaisedButton
                  tabIndex = {4}
                  primary = {true}
                  label = 'Add'
                  onTouchTap = { this.onAddPostBtnClick }
                  style = {    !(this.state.name || (this.state.images && this.state.images.length) || this.state.descr) ? styles.hid : styles.wishBtn }
                  disabled = { !(this.state.name || (this.state.images && this.state.images.length) || this.state.descr) }
                />
              </div>
            </div>

          </div>

          <div style={ focused ? null : styles.hid } >
            { showAddedImages }
            <div style={styles.addDescrInputWrap}>
              <TextField
                tabIndex={3}
                style={styles.addDescrInput}
                hintText='Description (multiline)'
                multiLine={true}
                rows={1}
                value={this.state.descr}
                onChange={this.handleChangeDescr}
                onKeyDown={this.handleKeyPressDescr}
              />
            </div>
          </div>

        </form>
      </Paper>
    )
  }
}

export default listensToClickOutside(AddPost)
