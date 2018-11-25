import * as THREE from 'three';

const randomSpherePoint = (radius) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = (radius * Math.sin(phi) * Math.cos(theta));
  const y = (radius * Math.sin(phi) * Math.sin(theta));
  const z = (radius * Math.cos(phi));
  return [x,y,z];
}

const COUNT_CITIES = 18;
const spheres = [];
const createPoint = (distance) => {
  for (let i = 0; i < COUNT_CITIES; i++) {
    const geometry = new THREE.SphereGeometry( 6, 8, 8 );
    const material = new THREE.MeshBasicMaterial( {color: 0xaf1491} );
    const sphere = new THREE.Mesh( geometry, material );
    const [x, y, z] = randomSpherePoint(distance);
    sphere.position.set(x, y, z);
    spheres.push(sphere);
  }

  fetch('http://hackyeahbe.azurewebsites.net/chcem/miasta')
  .then(response => response.json())
  .then(function(myJson) {
    spheres.forEach((sphere, index) => {
      const data = myJson.data[index];
      const vec = lonLatToVector3(data.longitude, data.latitude, distance);
      sphere.position.set(vec.x, vec.y, vec.z);
      sphere.cityId = data.cityID;
      sphere.name = data.cityName;
      sphere.country = data.country;
    })
  });
  return spheres;
}

const lonLatToVector3 = (lng, lat, radius) => {
  const phi = Math.PI * (0.5 - (lat / 180));
  const theta = Math.PI * (lng / 180);
  const spherical = THREE.Spherical(radius || radius || 1, phi, theta);
  return new THREE.Vector3().setFromSpherical(spherical);
};

export default createPoint;