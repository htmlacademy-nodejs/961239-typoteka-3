'use strict';

const uploadElem = document.getElementById(`upload`);
const showImage = document.getElementById(`preview_image`);

uploadElem.addEventListener(`change`, (evt) => {
  showImage.src = URL.createObjectURL(evt.target.files[0]);
});
