import Camera from "./camera";
import Rotation from "./rotation";
import Timeline from "./timeline";
import TouchController from "./touch-controller";
import Particles from "./particles";

export default [
	TouchController()(),
	Camera({ pitchSpeed: -0.01, yawSpeed: 0.01 }),
	Particles,
	Rotation,
	Timeline, 
	(entities, { touches }) => {

		if (touches.find(x => x.type === "start"))
			entities.grass.model.position.z -= 0.1

		return entities;
	}
];
