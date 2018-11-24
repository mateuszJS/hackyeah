let track = [];

// city = { name, country, id }
export const addNewCity = (city) => {
  track.push(city);
}

export const submitTrack = () => {
  console.log('submi track', track);
}