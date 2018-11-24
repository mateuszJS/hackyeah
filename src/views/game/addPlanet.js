import * as THREE from 'three';
import PlanetTexture from '../../assets/planet-texture.png';
import PointTexture from '../../assets/point.png';
import clamp from '../../utils/clamp';

const init = () => {
  const container = document.querySelector('.works-page');
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);

  const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
  camera.position.set(0, 0, 500);

  // create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000, 0);
  scene.add(camera);
  container.appendChild(renderer.domElement);
  const globe = createPlanet(scene);
  createPoint(scene);

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

const createPlanet = (scene) => {
  const RADIUS = clamp(70, window.innerWidth * 0.4, 400);
  const SEGMENTS = 50;
  const RINGS = 50;

  const globe = new THREE.Group();
  scene.add(globe);

  const loader = new THREE.TextureLoader();
  loader.load(PlanetTexture, (texture) => {
    const sphere = new THREE.SphereGeometry( RADIUS, SEGMENTS, RINGS );
    const material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
    const mesh = new THREE.Mesh( sphere, material );
    globe.add(mesh);
    globe.position.z = -300;

    const point = createPoint(globe, RADIUS);
    globe.add(point);

    const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 400;

    scene.add(pointLight);
  });

  // fetch('http://hackyeahbe.azurewebsites.net/chcem/miasta')
  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function(myJson) {
  //   console.log(JSON.stringify(myJson));
  // });

  return globe;
}

const createPoint = (parent, distance) => {
  let material;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const sprite = new THREE.TextureLoader().load(PointTexture);
  for ( let i = 0; i < 10; i ++ ) {
    const [x, y, z] = randomSpherePoint(distance);
    vertices.push( x, y, z );
  }
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
  material.color.setHSL( 1.0, 0.3, 0.7 );
  const particles = new THREE.Points( geometry, material );
  parent.add( particles );
}

const rotate = (object, axis, radians) => {
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis( axis.normalize(), radians );
  rotationMatrix.multiply( object.matrix );
  object.matrix = rotationMatrix;
  object.rotation.setFromRotationMatrix( object.matrix );
}

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

export default init;
