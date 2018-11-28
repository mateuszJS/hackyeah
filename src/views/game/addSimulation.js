import THREE from './customBuildThree';
import createPoint from './createPoint';
import createLight from './createLight';
import createPlanet from './createPlanet';
import { addNewCity, getTrack, removeLastCity } from './trackController';
import { createFlyLine, removeLastFlyLine, updateLines } from './flyLines.js';
import { validateTrack } from './validateTrack';
import clamp from '../../utils/clamp';

const calcCameraDistance = dangerX => {
  const x = clamp(350, dangerX, 800);
  return 0.00310259 * Math.pow(x, 2) - 5.41643 * x + 3170.16;
}

const init = () => {
  const container = document.querySelector('.wrapper-game');
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const raygun = new THREE.Raycaster();
  raygun.params.Points.threshold = 20;
  const RADIUS = 250;
  
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor( 0x000000, 0 );

  const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
  camera.position.set(0, 0, calcCameraDistance(WIDTH));

  // create scene
  const scene = new THREE.Scene();
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
    const hits = raygun.intersectObjects(scene.children, true);
    if (hits.length === 0) return;
  
    const dataFromPoint = hits[0].object;
    if (dataFromPoint.customType === 'PLANET') {
      return; // it's click on planet
    }
  
    const track = getTrack();
    if (dataFromPoint.customType === 'UNDO_BUTTON') { // remove last place
      const lastCity = track[track.length - 1];
      lastCity.material.color.set(0x2e3e82);
      removeLastCity();

      // Remove last curve line
      const prevCityPos = track[track.length - 2].position;
      const lastCityPos = track[track.length - 1].position;
      removeLastFlyLine(globe, prevCityPos, lastCityPos);
    } else { // add new place
      const valdiTrack = validateTrack(dataFromPoint, track, RADIUS);
      if (!valdiTrack) return;
      dataFromPoint.material.color.set(0xe8b628);
      addNewCity(dataFromPoint);

      if (track.length >= 2) {
        if (dataFromPoint.customType === 'CITY') { // if it's adding action
          const prevCityPos = track[track.length - 2].position;
          const lastCityPos = track[track.length - 1].position;
          createFlyLine(globe, prevCityPos, lastCityPos);
        }
      }
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

    updateLines();

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
