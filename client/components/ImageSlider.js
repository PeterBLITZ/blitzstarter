import React, { Component } from 'react'

const styles = {
  imageSliderOut: {
    overflowX: 'scroll',
    width: '100%'
  },
  imageSliderIn: {
    whiteSpace: 'nowrap'
  },
  imageSliderElem: {
    display: 'inline-block',
    height: '150px'
  },
  imageSliderElemWrap: {
    display: 'inline-block'
  }
}

class ImageSlider extends Component {
  render() {
    const { images, onImageClick, edit } = this.props;
    let showImages;
    if ( images && images.length ) {
      if ( images.length > 1 || onImageClick ) {
      showImages =
        <div>
          {images.map((image, index) => <div key={index+image} style={styles.imageSliderElemWrap} className={edit ? 'imageSliderElem' : null} ><img onClick={onImageClick} style={styles.imageSliderElem} src={`/uploads/${image}`} /></div>)}
        </div>
      }
    }
    return (
      <div style={styles.imageSliderOut} >
        <div  style={styles.imageSliderIn} >
          {showImages}
        </div>
      </div>
    )
  }
}

export default ImageSlider
