import ExpoTHREE, { THREE } from "expo-three";
import functions from "./functions.js";
import { getHashCode } from "../../utils";

//-- https://www.mtmckenna.com/posts/2017/11/06/extending-the-built-in-phong-material-shader-in-threejs
//-- https://medium.com/@pailhead011/extending-three-js-materials-with-glsl-78ea7bbb9270

const AnemoneMaterial = (
	{
		time = 0.0,
		speed = new THREE.Vector3(0, 0, 0),
		terrainSeed = 0.5,
		terrainHeight = 0.35,
		update = null,
		meshHeight = 0,
		effectiveness = 0.01,
		displacementScale = new THREE.Vector3(0, 1, 0),
		displacementExpression = "displacementScale",
		offsetExpressions = {
			x: "position.x + tx",
			y: "position.y + ty",
			z: "position.z + tz"
		},
		...rest
	},
	Material = THREE.MeshPhongMaterial
) => {
	const material = new Material(rest);

	material.flatShading = true;
	material.transparent = true;
	material.userData.time = { value: time };
	material.userData.speed = { value: speed };
	material.userData.terrainSeed = { value: terrainSeed };
	material.userData.terrainHeight = { value: terrainHeight };
	material.userData.meshHeight = { value: meshHeight };
	material.userData.effectiveness = { value: effectiveness };
	material.userData.displacementScale = { value: displacementScale };

	material.onBeforeRender = () => {
		if (update) update(material.userData);
	};

	material.onBeforeCompile = shader => {
		shader.uniforms.time = material.userData.time;
		shader.uniforms.speed = material.userData.speed;
		shader.uniforms.terrainSeed = material.userData.terrainSeed;
		shader.uniforms.terrainHeight = material.userData.terrainHeight;
		shader.uniforms.meshHeight = material.userData.meshHeight;
		shader.uniforms.effectiveness = material.userData.effectiveness;
		shader.uniforms.displacementScale = material.userData.displacementScale;

		const noiseChunk = `
			if ((meshHeightLeZero || position.y >= vertexSelectionTest) && effectivenessGtZero) {
				float tx = modelMatrix[3][0];
				float ty = modelMatrix[3][1];
				float tz = modelMatrix[3][2];
				vec3 offset = vec3(${offsetExpressions.x}, ${offsetExpressions.y}, ${offsetExpressions.z});
		  		float displacement = noise(terrainSeed + offset + vec3(speed * time));
				transformed =  ${displacementExpression} * vec3(displacement * terrainHeight) + position;
			}
			        
            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		`;

		shader.vertexShader = `
			#include <noise>
			uniform float time;
			uniform vec3 speed;
			uniform float terrainSeed;
			uniform float terrainHeight;
			uniform float meshHeight;
			uniform float effectiveness;
			uniform vec3 displacementScale;
			float meshTop = meshHeight - (meshHeight * 0.5);
			float distortionDepth = meshHeight * effectiveness;
			float vertexSelectionTest = meshTop - distortionDepth;
			bool meshHeightLeZero = meshHeight <= 0.0;
			bool effectivenessGtZero = effectiveness > 0.0;
			
			${shader.vertexShader.replace("#include <project_vertex>", noiseChunk)}
		`;
	};

	material.onBeforeCompile.toString = () =>
		getHashCode(JSON.stringify(offsetExpressions) + displacementExpression);

	return material;
};

module.exports = AnemoneMaterial;
