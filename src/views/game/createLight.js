import THREE from './customBuildThree';

const createLight = () => {
  const pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 400;
  return pointLight;
}

export default createLight;