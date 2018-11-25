import * as THREE from 'three';
import PlanetTexture from '../../assets/purple-map.png';

const createPlanet = (radius) => {
  const SEGMENTS = 50;
  const RINGS = 50;

  const globe = new THREE.Group();

  const loader = new THREE.TextureLoader();
  loader.load(PlanetTexture, (texture) => {
    const sphere = new THREE.SphereGeometry( radius, SEGMENTS, RINGS );
    const material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, transparent: true } );
    const mesh = new THREE.Mesh( sphere, material );
    mesh.isPlanet = true;
    mesh.rotateY(-1.565); // NOTE: now it's right long and lang
    globe.add(mesh);
    globe.position.z = -300;
    globe.position.y = 10;
  });

  return globe;
}

export default createPlanet;