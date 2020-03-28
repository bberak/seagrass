import React from "react";
import { GameEngine } from "react-native-game-engine";
import Renderer from "./graphics/renderer";
import Systems from "./systems";
import Entities from "./entities";

import ShaderPass from "./graphics/passes/shader-pass";
import UnrealBloomPass from "./graphics/passes/unreal-bloom-pass";
import PixelShader from "./graphics/shaders/pixel-shader";

class Game extends React.Component {
  render() {
    return (
      <GameEngine
        style={{ backgroundColor: "black" }}
        systems={Systems}
        entities={Entities()}
        renderer={Renderer(
          new UnrealBloomPass()
        )}
      />
    );
  }
}

export default Game;
