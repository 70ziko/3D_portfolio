import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
 });

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

function onWindowResize() {
  // Update the size of the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update the aspect ratio of the camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Add an event listener to the window to call the onWindowResize function whenever the window is resized
window.addEventListener('resize', onWindowResize);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

const Mesh = new THREE.Mesh(geometry, material);
scene.add(Mesh);

function animate() {
  requestAnimationFrame(animate);

  Mesh.rotation.x += 0.01;
  Mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

const light = new THREE.PointLight(0xffffff, 1, 1000);

light.position.set(0, 0, 5);
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light);

 scene.add(lightHelper);

function updateLightPosition(event, camera, light, renderer, scene) {
  // Calculate the mouse position in normalized device coordinates (-1 to 1)
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Create a raycaster from the camera position and mouse position
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Get the intersection point between the raycaster and the scene
  const intersection = raycaster.intersectObjects(scene.children);

  // Set the light position to the intersection point, or the camera position if there is no intersection
  if (intersection.length > 0) {
    light.position.copy(intersection[0].point);
  } else {
    const distance = 100; // distance from camera to light
    const position = new THREE.Vector3();
    position.copy(camera.position);
    position.add(raycaster.ray.direction.multiplyScalar(distance));
    light.position.copy(position);
  }

  // Render the scene
  renderer.render(scene, camera);
}

window.addEventListener('mousemove', (event) => {
  updateLightPosition(event, camera, light, renderer, scene);
});