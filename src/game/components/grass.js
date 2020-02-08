import { THREE } from "expo-three";
import { add } from "../utils/three";

export default ({
	parent,
	width = 3,
	height = 6,
	strandWidth = 0.1,
	strandHeight = 0.3,
	gapWidth = 0.06,
	gapHeight = 0.12,
	scale = 1,
	color = 0x00e6ff
}) => {

	const geo = new THREE.Geometry();
	const materials = [];

	for (var y = 0; y < height; y += gapHeight ) {
		for (var x = 0; x < width; x += gapWidth) {
			plane = new THREE.Mesh(new THREE.PlaneGeometry(strandWidth, strandHeight + Math.random() * 0.3));
			plane.position.x = x;
			plane.position.y = y;
			plane.rotation.x = Math.PI * 0.4;
			plane.rotation.y = x / 2 + Math.random() * 0.3;
			plane.updateMatrix();
			geo.merge(plane.geometry, plane.matrix);

			materials.push(new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }));
		}
	}

	const grass = new THREE.Mesh(geo, materials);

	grass.position.x = width * -0.5;
	grass.position.z = width * -0.5;
	grass.rotation.x = Math.PI * 0.5
	grass.scale.x = scale;
	grass.scale.y = scale;
	grass.scale.z = scale;

	add(parent, grass);

	return {
		model: grass,
		rotationx: {
			z: 0.02
		}
	};
};
