'use strict';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};


const getRandomDate = () => {
  const now = Date.now();
  const limit = new Date().setMonth(new Date().getMonth() - 3);
  const date = new Date(getRandomInt(limit, now)).toISOString();
  return date;
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate
};

