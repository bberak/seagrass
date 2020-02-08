import { THREE } from "expo-three";
import { add } from "../utils/three";

export default ({
	parent,
	x = 0,
	y = 0,
	z = 0,
	width = 1.1,
	height = 1.1,
	scale = 1,
	color = 0x00e6ff
}) => {
	const geometry = new THREE.PlaneGeometry(width, height);
	const material = new THREE.MeshStandardMaterial({ color });
	const plane = new THREE.Mesh(geometry, material);

	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;
	plane.scale.x = scale;
	plane.scale.y = scale;
	plane.scale.z = scale;

	add(parent, plane);

	return {
		model: plane,
		rotation: {
			z: 0.02
		}
	};
};
