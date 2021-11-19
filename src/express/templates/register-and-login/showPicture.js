'use strict';

// eslint-disable-next-line no-undef
const uploadElem = document.getElementById(`upload`);
// eslint-disable-next-line no-undef
const showImage = document.getElementById(`preview_image`);

uploadElem.addEventListener(`change`, (evt) => {
  showImage.src = URL.createObjectURL(evt.target.files[0]);
});
