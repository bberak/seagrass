import ExpoTHREE, { THREE } from "expo-three";
import { add } from "../utils/three";
import Material from "../graphics/materials/grass.js";
import SeagrassTexture from "../../assets/textures/seagrass.png";
import SeagrassNormalTexture from "../../assets/textures/seagrass-normal.png";

export default async ({
	parent,
	width = 3,
	height = 6,
	strandWidth = 0.1,
	strandHeight = 0.3,
	gapWidth = 0.12,
	gapHeight = 0.24,
	scale = 1,
	color = 0x00e6ff
}) => {
	const texture = await ExpoTHREE.loadAsync(SeagrassTexture);
	const normalTexture = await ExpoTHREE.loadAsync(SeagrassNormalTexture);
	const geo = new THREE.Geometry();

	for (var y = 0; y < height; y += gapHeight) {
		for (var x = 0; x < width; x += gapWidth) {
			plane = new THREE.Mesh(
				new THREE.PlaneGeometry(
					strandWidth,
					strandHeight + Math.random() * 0.3
				)
			);
			plane.position.x = x;
			plane.position.y = y;
			plane.rotation.x = Math.PI * -0.6;
			plane.updateMatrix();
			geo.merge(plane.geometry, plane.matrix);
		}
	}

	const grass = new THREE.Mesh(
		geo,
		new Material({
			side: THREE.FrontSide,
			transparent: false,
			map: texture,
			normalMap: normalTexture,
		})
	);
	grass.position.x = width * -0.5;
	grass.position.z = width * -0.5;
	grass.rotation.x = Math.PI * 0.5;
	grass.scale.x = scale;
	grass.scale.y = scale;
	grass.scale.z = scale;

	add(parent, grass);

	grass.onBeforeRender = (renderer, scene, camera, geometry, material) => {
		if (material.onBeforeRender)
			material.onBeforeRender();
	}

	return {
		model: grass,
		rotationx: {
			z: 0.02
		}
	};
};
