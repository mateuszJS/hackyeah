import THREE from './customBuildThree';
import { cities } from './data';

const createPoint = (distance) => {
  const spheres = [];
  for (let i = 0; i < cities.length; i++) {
    const geometry = new THREE.SphereGeometry( 6, 8, 8 );
    const material = new THREE.MeshBasicMaterial( {color: 0x2e3e82} );
    const sphere = new THREE.Mesh( geometry, material );

    const data = cities[i];
    const vec = lonLatToVector3(data.longitude, data.latitude, distance);

    sphere.position.set(vec.x, vec.y, vec.z);
    sphere.cityId = data.cityID;
    sphere.name = data.cityName;
    sphere.country = data.country;
    sphere.customType = 'CITY';
    spheres.push(sphere);
  }
  return spheres;
}

const lonLatToVector3 = (lng, lat, radius) => {
  const phi = Math.PI * (0.5 - (lat / 180));
  const theta = Math.PI * (lng / 180);
  const spherical = THREE.Spherical(radius || radius || 1, phi, theta);
  return new THREE.Vector3().setFromSpherical(spherical);
};

export default createPoint;