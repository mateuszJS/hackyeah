import { updatePlace, updatePrice } from './updateNodes';

let track = [];

// city = { name, country, id }
const updateHTML = () => {
  const lastCity = track[track.length -1];
  updatePlace(lastCity.country, lastCity.name);
  updatePrice(track.length * 100);
}

export const addNewCity = (city) => {
  track.push(city);
  updateHTML();
}

export const removeLastCity = () => {
  track.pop();
  updateHTML();
}

export const submitTrack = () => {
  console.log('submi track', track);
}

export const getTrack = () => track;