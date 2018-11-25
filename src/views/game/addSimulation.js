import * as THREE from 'three';
import clamp from '../../utils/clamp';
import createPoint from './createPoint';
import createLight from './createLight';
import createPlanet from './createPlanet';
import { addNewCity, getTrack, removeLastCity } from './trackController';
import createUndoButton from './createUndoButton';

let undoButton;
const curveLines = [];
const init = () => {
  const container = document.querySelector('.works-page');
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const raygun = new THREE.Raycaster();
  raygun.params.Points.threshold = 20;
  const RADIUS = clamp(70, window.innerWidth * 0.35, 400);
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor( 0x000000, 0 );

  const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
  camera.position.set(0, 0, 500);


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
    const interactionArray = scene.children;// undoButton ? points.concat([undoButton, globe.children[1]]) : points;
    const hits = raygun.intersectObjects(interactionArray, true);
    if (hits.length > 0) {
      const dataFromPoint = hits[0].object;
      if (dataFromPoint.isPlanet) {
        return; //it's click on planet
      }
      if (dataFromPoint.type === 'Points') { // remove last track
        const track = getTrack();
        const lastCity = track[track.length - 1];
        lastCity.material.color.set(0xffff00);
        removeLastCity();

        // Remove last curve line
        const lastCurve = curveLines[curveLines.length - 1];
        lastCurve.geometry.dispose();
        lastCurve.material.dispose();
        globe.remove(lastCurve);
        curveLines.pop();

      } else {
        const track = getTrack();
        const alreadyExists = track.reduce((acc, item) => {
          return acc ? true : dataFromPoint === item;
        }, false)

        if (alreadyExists) {
          alert('Hej! Koleżko, nie wiesz że rutyna zabija, juz raz to dodałeś!!!');
          return; // to avoid copy item in array
        }

        if (track.length > 1) { // When it's already exists start point
          const lastCity = track[track.length - 1];

          const distance = Math.hypot(
            lastCity.position.x - dataFromPoint.position.x,
            lastCity.position.y - dataFromPoint.position.y,
            lastCity.position.z - dataFromPoint.position.z
          );
          console.log(distance, Math.PI * 0.4 * RADIUS)
          if (distance > Math.PI * 0.4 * RADIUS) { // too far (avoid bug with hidden icon in sphere)
            alert('Hola hola smyku, zbyt daleko podążasz!');
            return;
          }
        }


        dataFromPoint.material.color.set(0x0000ff);
        addNewCity(dataFromPoint);
      }
      // update, depends on track
      const track = getTrack();

      if (track.length >= 2) {
        // draw curve line
        const prevCity = track[track.length - 2];
        const lastCity = track[track.length - 1];
        const centerX = (lastCity.position.x + prevCity.position.x) / 2;
        const centerY = (lastCity.position.y + prevCity.position.y) / 2;
        const centerZ = (lastCity.position.z + prevCity.position.z) / 2;

        const distance = Math.hypot(
          lastCity.position.x - prevCity.position.x,
          lastCity.position.y - prevCity.position.y,
          lastCity.position.z - prevCity.position.z
        );

        const vecBetween = new THREE.Vector3(
          2 * centerX,
          2 * centerY,
          2 * centerZ
        );

        const curve = new THREE.QuadraticBezierCurve3(
          prevCity.position,
          vecBetween,
          lastCity.position
        );
        
        if (dataFromPoint.type === 'Mesh') { // if it's adding action
          const points = curve.getPoints( 50 );
          const geometry = new THREE.BufferGeometry().setFromPoints( points );
          const material = new THREE.LineBasicMaterial( { color : 0xaf1491, linewidth: 5, thickness: 10 } );
          const curveObject = new THREE.Line( geometry, material );
          // material.linewidth = 50;
          // curveObject.linewidth = 50;
          globe.add(curveObject);
          curveLines.push(curveObject);
        }

        // create button to undo last move
        if (undoButton) {
          undoButton.geometry.dispose();
          undoButton.material.dispose();
          globe.remove(undoButton);
        }
        undoButton = createUndoButton(
          1.6 * centerX,
          1.6 * centerY,
          1.6 * centerZ
        );
        globe.add(undoButton);
      } else if (track.length === 1) {
        if (undoButton) {
          undoButton.geometry.dispose();
          undoButton.material.dispose();
          globe.remove(undoButton);
          undoButton = undefined;
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
