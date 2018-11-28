import THREE from './customBuildThree';
import {MeshLineMaterial, MeshLine } from 'three.meshline';
import { addUndoButton, removeUndoButton } from './updateUndoButton';

const lines = [];
const linesGeometry = [];

// https://www.wolframalpha.com/input/?i=quadratic+fit+%7B0,+0%7D,+%7B132,+0.2%7D,+%7B239,+0.4+%7D,+%7B312,+1%7D,+%7B355,+2.5%7D
const calcHeightOfFly = x => {
  const safeX = Math.max(205, x);
  const result = 0.0000286759 * Math.pow(safeX, 2) - 0.00499423 * safeX + 0.0882118;
  return Math.min(result, 3);
}

export const createFlyLine = (container, pointA, pointB) => {
  const distance = Math.hypot(
    pointA.x - pointB.x,
    pointA.y - pointB.y,
    pointA.z - pointB.z
  );
  const height = 1 + calcHeightOfFly(distance);
  const vecBetween = new THREE.Vector3(
    (pointA.x + pointB.x) / 2,
    (pointA.y + pointB.y) / 2,
    (pointA.z + pointB.z) / 2
  );
  vecBetween.multiplyScalar(height)

  const geometry = createCurve(pointA, vecBetween, pointB)
  const material = new MeshLineMaterial({
    color : new THREE.Color(0xe8b628),
    lineWidth: 3,
    transparent: true
  });

  const line = new MeshLine();
  line.setGeometry(geometry , function( p ) { return 2; } );

  const curveObject = new THREE.Mesh( line.geometry, material );

  curveObject.animationTime = 0;
  lines.push(curveObject);
  linesGeometry.push(geometry);
  container.add(curveObject);
	
  removeUndoButton(container);
  const btnPositionIndex = Math.floor(geometry.vertices.length / 2);
  const btnPosition = geometry.vertices[btnPositionIndex];
  addUndoButton(container, btnPosition);
}

export const removeLastFlyLine = (container) => {
  const lastCurve = lines.pop();
  const lastGeometry = linesGeometry.pop()


  if (lines.length > 0) {
    removeUndoButton(container);
    const vertices = linesGeometry[linesGeometry.length - 1].vertices;
    const btnPositionIndex = Math.floor(vertices.length / 2);
    const btnPosition = vertices[btnPositionIndex];
    addUndoButton(container, btnPosition);
  }

  lastCurve.geometry.dispose();
  lastCurve.material.dispose();
  container.remove(lastCurve);
}

const createCurve = (vecA, vecB, vecC) => {
	const s = new THREE.ConstantSpline();
	s.inc = .01;
	s.p0 = vecA;
	s.p1 = vecA;
	s.p2 = vecB;
	s.p3 = vecC;

	s.calculate();
	s.calculateDistances();
	s.reticulate( { steps: 30 } );
 	const geometry = new THREE.Geometry();

	for( let j = 0; j < s.lPoints.length - 1; j++ ) {
		geometry.vertices.push( s.lPoints[ j ].clone() );
  }
	return geometry;
}

export const updateLines = () => {
  lines.forEach(line => {
    if (line.animationTime < 1) {
      line.material.uniforms.visibility.value= line.animationTime % 1.0;
      line.animationTime += 0.015;
    }
  })
}