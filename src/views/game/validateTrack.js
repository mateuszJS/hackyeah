export const validateTrack = (newPoint, track, radius) => {
  console.log(newPoint, track, radius);
  const alreadyExists = track.reduce((acc, item) => {
    return acc ? true : newPoint === item;
  }, false)

  if (alreadyExists) {
    alert('Hej! Koleżko, nie wiesz że rutyna zabija, juz raz to dodałeś!!!');
    return false; // to avoid copy item in array
  }

  if (track.length > 0) { // When it's already exists start point
    const lastCity = track[track.length - 1];

    const distance = Math.hypot(
      lastCity.position.x - newPoint.position.x,
      lastCity.position.y - newPoint.position.y,
      lastCity.position.z - newPoint.position.z
    );
    if (distance > radius * 1.7) { // too far (avoid bug with hidden icon in sphere)
      alert('Hola hola smyku, zbyt daleko podążasz!');
      return false;
    }
  }
  return true;
}