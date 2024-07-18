import { OrbitControls } from "@react-three/drei";
import { useThree, extend, useLoader, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import vertexShader from './shaders/wobble/vertex.glsl';
import fragmentShader from './shaders/wobble/fragment.glsl';
import * as THREE from "three";
import { useControls } from "leva";

class CustomMeshPhysicalMaterial extends CustomShaderMaterial {
    constructor(parameters) {
      super({
        baseMaterial: THREE.MeshPhysicalMaterial,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        silent: true,
        ...parameters,
      });
    }
  }
  

// useLoader(GLTFLoader, '', (loader) => {
  //     const dracoLoader = new DRACOLoader()
  //     dracoLoader.setDecoderPath('./draco/')
  //     loader.setDRACOLoader(dracoLoader)
  // })

extend({ CustomMeshPhysicalMaterial })

export default function Experience() {
  const { scene, } = useThree();
  const wobble = useRef();
  const material = useRef();
  const plane = useRef();

  const controls = useControls({
    metalness: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.001
    },
    roughness: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.001
    },
    transmission: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.001
    },
    ior: {
        value: 1.5,
        min: 0,
        max: 10,
        step: 0.001
    },
    thickness: {
        value: 1.5,
        min: 0,
        max: 10,
        step: 0.001
    },
    color: '#ffffff'
  })

  const environmentMap = useLoader(
    RGBELoader,
    "./urban_alley_01_1k.hdr",
    (loader) => {
      loader.load("./urban_alley_01_1k.hdr");
    }
  );
  useFrame((state) => {
    const { elapsedTime } = state.clock
  })
  
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
        args={['#ffffff', 3]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[0.25, 2, -2.25]}
        />

      {/* Wobble sphere */}
      <mesh ref={wobble}
        receiveShadow={true}
        castShadow={true}
      >
        <customMeshPhysicalMaterial
          ref={material}
          metalness={controls.metalness}
          roughness={controls.roughness}
          color={controls.color}
          transmission={controls.transmission}
          ior={controls.ior}
          thickness={controls.thickness}
          transparent={true}
          wireframe={false}
        />
        <icosahedronGeometry args={[2.5, 50]} />
      </mesh>
      {/* Plane */}
      <mesh ref={plane} 
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
