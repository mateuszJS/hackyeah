import THREE from './customBuildThree';
import PointTexture from '../../assets/undo.png';

let undoButton = null;

export const addUndoButton = (container, point,) => {
  const x = point.x * 1.05;
  const y = point.y * 1.05;
  const z = point.z * 1.05;
  
  const vertices = [x, y, z];
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  const sprite = new THREE.TextureLoader().load(PointTexture);
  const material = new THREE.PointsMaterial({
    size: 20,
    sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.5,
    transparent: true
  });

  undoButton = new THREE.Points( geometry, material );
  undoButton.customType = 'UNDO_BUTTON';
  container.add(undoButton);
}

export const removeUndoButton = (container) => {
  if (undoButton) {
    undoButton.geometry.dispose();
    undoButton.material.dispose();
    container.remove(undoButton);
    undoButton = null;
  }
}