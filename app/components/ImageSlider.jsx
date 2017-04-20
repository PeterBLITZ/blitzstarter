import React from 'react';

const styles = {
  imageSliderOut: {
    overflowX: 'scroll',
    width: '100%',
  },
  imageSliderIn: {
    whiteSpace: 'nowrap',
  },
  imageSliderElem: {
    display: 'inline-block',
    height: '150px',
  },
  imageSliderElemWrap: {
    display: 'inline-block',
  },
};

const ImageSlider = props => {
  const { images, onImageClick, edit } = props;
  let showImages;
  if (images && images.length) {
    if (images.length > 1 || onImageClick) {
      showImages = (
        <div>
          {images.map(image => (
            <div
              key={image}
              style={styles.imageSliderElemWrap}
              className={edit ? 'imageSliderElem' : null}
            >
              <img
                onClick={onImageClick}
                style={styles.imageSliderElem}
                src={`/uploads/${image}`}
                alt='Post header'
              />
            </div>
          ))}
        </div>
      );
    }
  }
  return (
    <div style={styles.imageSliderOut}>
      <div style={styles.imageSliderIn}>
        {showImages}
      </div>
    </div>
  );
};

export default ImageSlider;
