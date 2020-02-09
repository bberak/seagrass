import { THREE } from "expo-three";
import functions from "./functions.js";
import { getHashCode } from "../../utils";

//-- https://www.mtmckenna.com/posts/2017/11/06/extending-the-built-in-phong-material-shader-in-threejs
//-- https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270

const GrassMaterial = (
	{
		time = 0.0,
		speed = new THREE.Vector3(1, 0, 0),
		seed = 0.5,
		effectiveness = 0.01,
		...rest
	},
	Material = THREE.MeshPhongMaterial
) => {
	const material = new Material(rest);

	material.flatShading = true;
	material.transparent = true;
	material.userData.time = { value: time };
	material.userData.speed = { value: speed };
	material.userData.seed = { value: seed };

	material.onBeforeRender = () => {
		material.userData.time.value += 0.01;
	};

	material.onBeforeCompile = shader => {
		shader.uniforms.time = material.userData.time;
		shader.uniforms.speed = material.userData.speed;
		shader.uniforms.seed = material.userData.seed;

		const noiseChunk = `
			float tx = modelMatrix[3][0];
			float ty = modelMatrix[3][1];
			float tz = modelMatrix[3][2];
			vec3 offset = vec3(position.x + tx, 0, 0);
	  		float displacement = noise(seed + offset + vec3(speed * time));
			transformed = vec3(1, 0, 0) * vec3(displacement) + position;

            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		`;

		shader.vertexShader = `
			#include <noise>
			uniform float time;
			uniform vec3 speed;
			uniform float seed;
			
			${shader.vertexShader.replace("#include <project_vertex>", noiseChunk)}
		`;
	};

	return material;
};

module.exports = GrassMaterial;
