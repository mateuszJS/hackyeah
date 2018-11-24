import * as THREE from 'three';
import clamp from '../../utils/clamp';
import createPoint from './createPoint';
import createLight from './createLight';
import createPlanet from './createPlanet';


let mouse = new THREE.Vector2(0,0);
let raygun = new THREE.Raycaster();
raygun.params.Points.threshold = 50;

let camera;

const init = () => {
  const container = document.querySelector('.works-page');
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const RADIUS = clamp(70, window.innerWidth * 0.4, 400);
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);

  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
  camera.position.set(0, 0, 500);


  // create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000, 0);
  scene.add(camera);

  container.appendChild(renderer.domElement);
  
  const light = createLight();
  scene.add(light);


  const globe = createPlanet(RADIUS);
  scene.add(globe);

  const points = createPoint(RADIUS, raygun);
  points.forEach(point => globe.add(point));

  let mouseButtonIsDown = false;
  document.addEventListener('mousedown', () => mouseButtonIsDown = true);
  document.addEventListener('mouseup', () => mouseButtonIsDown = false);
  const friction = {
    modX: null,
    modY: null
  }
  
  const lastMove = {
    modX: window.innerWidth / 2,
    modY: window.innerHeight / 2
  };

  const MAX_MOVE = 0.05;

  const rotateOnMouseMove = (event) => {
    if (!mouseButtonIsDown) return;

    if (lastMove.modX === null) {
      lastMove.modX = event.clientX;
      lastMove.modY = event.clientY;
      return;
    }
    const moveX = (event.clientX - lastMove.modX);
    const moveY = (event.clientY - lastMove.modY);

    lastMove.modX = event.clientX;
    lastMove.modY = event.clientY;

    friction.modX = Math.max(-MAX_MOVE, Math.min(moveX * 0.002, MAX_MOVE));
    friction.modY = Math.max(-MAX_MOVE, Math.min(moveY * 0.002, MAX_MOVE));
  }


  const onClick = () => {
    const x = ( event.clientX / window.innerWidth ) * 2 - 1;
    const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raygun.setFromCamera({x, y}, camera);
    const hits = raygun.intersectObjects(points, true);
    if (hits.length > 0) {
      hits[0].object.material.color.set(0x0000ff);
      renderer.render(scene, camera);
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('mousemove', rotateOnMouseMove);

  const update = () => {
    friction.modX = Math.abs(friction.modX) < 0.001 ? 0 : friction.modX * 0.98;
    friction.modY = Math.abs(friction.modY) < 0.001 ? 0 : friction.modY * 0.98; 

    rotate(globe, new THREE.Vector3(0, 1, 0), friction.modX);
    rotate(globe, new THREE.Vector3(1, 0, 0), friction.modY);

    renderer.render( scene, camera );
    requestAnimationFrame(update);  
  }
  requestAnimationFrame(update);
}

const rotate = (object, axis, radians) => {
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis( axis.normalize(), radians );
  rotationMatrix.multiply( object.matrix );
  object.matrix = rotationMatrix;
  object.rotation.setFromRotationMatrix( object.matrix );
}


export default init;
