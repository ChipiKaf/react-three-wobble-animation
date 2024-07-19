import { OrbitControls } from "@react-three/drei";
import { useThree, extend, useLoader, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import vertexShader from "./shaders/wobble/vertex.glsl";
import fragmentShader from "./shaders/wobble/fragment.glsl";
import * as THREE from "three";
import { useControls } from "leva";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createControlConfig } from "./utils/objectUtils";

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),

  uWarpPositionFrequency: new THREE.Uniform(0.38),
  uWarpTimeFrequency: new THREE.Uniform(0.12),
  uWarpStrength: new THREE.Uniform(1.7),

  uColorA: new THREE.Uniform(new THREE.Color("#0000ff")),
  uColorB: new THREE.Uniform(new THREE.Color("#ff0000")),
};
class CustomMeshPhysicalMaterial extends CustomShaderMaterial {
  constructor(parameters) {
    super({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms,
      silent: true,
      ...parameters,
    });
  }
}

extend({ CustomMeshPhysicalMaterial });

export default function Experience() {
  const { scene } = useThree();
  const wobble = useRef();
  const material = useRef();
  const plane = useRef();

  const controlsMaterial = useControls("Material", {
    metalness: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
    },
    roughness: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.001,
    },
    transmission: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
    },
    ior: {
      value: 1.5,
      min: 0,
      max: 10,
      step: 0.001,
    },
    thickness: {
      value: 1.5,
      min: 0,
      max: 10,
      step: 0.001,
    },
  });

  const controlsUniform = useControls("Uniform", createControlConfig(uniforms));

  const environmentMap = useLoader(
    RGBELoader,
    "./urban_alley_01_1k.hdr",
    (loader) => {
      loader.load("./urban_alley_01_1k.hdr");
    }
  );
  const mergedGeometry = useMemo(() => {
    let geometry = new THREE.IcosahedronGeometry(2.5, 50);
    geometry = mergeVertices(geometry);
    geometry.computeTangents();
    return geometry;
  }, []);

  // Alternative way to attach custom shader material
  const depthMaterial = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader,
      silent: true,
      uniforms,

      // MeshDepthMaterial
      depthPacking: THREE.RGBADepthPacking,
    });
  }, []);

  useFrame((state) => {
    const { elapsedTime } = state.clock;
    material.current.uniforms.uTime.value = elapsedTime;

    depthMaterial.uniforms.uTime.value = elapsedTime;
  });

  useEffect(() => {
    Object.entries(controlsUniform).forEach(([key, value]) => {
      if (key.toLowerCase().includes("color")) {
        material.current.uniforms[key].value.set(value);
        depthMaterial.uniforms[key].value.set(value);
      } else {
        material.current.uniforms[key].value = value;
        depthMaterial.uniforms[key].value = value;
      }
    });
  }, [controlsUniform]);

  // #region CustomShader primitive alt
  // Alternative way to attach custom shader material
  // const customShaderMaterial = useMemo(() => {
  //   return new CustomShaderMaterial({
  //     baseMaterial: THREE.MeshPhysicalMaterial,
  //     vertexShader,
  //     fragmentShader,
  //     metalness: 0,
  //     roughness: 0.5,
  //     color: "#ffffff",
  //     transmission: 0,
  //     ior: 1.5,
  //     thickness: 1.5,
  //     transparent: true,
  //     wireframe: false
  //   })
  // }, [])
  //#endregion

  useEffect(() => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
  }, [environmentMap]);

  return (
    <>
      <OrbitControls />
      {/* Light */}

      <directionalLight
        args={["#ffffff", 3]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[0.25, 2, -2.25]}
      />

      {/* Wobble sphere */}
      <mesh
        ref={wobble}
        receiveShadow={true}
        castShadow={true}
        customDepthMaterial={depthMaterial}
      >
        {/* <primitive object={customShaderMaterial} attach="material" /> */}
        <customMeshPhysicalMaterial
          ref={material}
          metalness={controlsMaterial.metalness}
          roughness={controlsMaterial.roughness}
          color={controlsMaterial.color}
          transmission={controlsMaterial.transmission}
          ior={controlsMaterial.ior}
          thickness={controlsMaterial.thickness}
          transparent={true}
          wireframe={false}
        />
        <primitive object={mergedGeometry} attach="geometry" />
      </mesh>
      {/* Plane */}
      <mesh
        ref={plane}
        receiveShadow={true}
        castShadow={true}
        rotation-y={Math.PI}
        position-y={-5}
        position-z={5}
      >
        <meshStandardMaterial />
        <planeGeometry args={[15, 15, 15]} />
      </mesh>
    </>
  );
}
