import * as THREE from 'three';
import PointTexture from '../../assets/undo.png';

const createButtonUndo = (x, y, z) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const sprite = new THREE.TextureLoader().load(PointTexture);
  vertices.push( x, y, z );
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  const material = new THREE.PointsMaterial( { size: 20, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
  // material.color.setHSL( 1.0, 0.3, 0.7 );
  const particles = new THREE.Points( geometry, material );
  return particles;
}

export default createButtonUndo;