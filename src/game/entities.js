import { THREE } from 'expo-three';
import { clear } from "./utils/three";
import Camera from "./components/camera";
import Grass from "./components/grass";

const scene = new THREE.Scene();
const camera = Camera();

export default async () => {
	clear(scene);

	const ambient = new THREE.AmbientLight(0xffffff, 1);
	const sunlight = new THREE.DirectionalLight(0xffffff, 0.95);

    sunlight.position.set(50, 50, 50);

    scene.add(ambient);
    scene.add(sunlight);

	camera.position.set(0, 2, 6);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const entities = {
		scene,
		camera,
		grass: Grass({ parent: scene })
	}

	return entities;
};