import { OrbitControls } from "@react-three/drei";
import { useThree, extend, useLoader, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useControls } from "leva";
  
// useLoader(GLTFLoader, '', (loader) => {
  //     const dracoLoader = new DRACOLoader()
  //     dracoLoader.setDecoderPath('./draco/')
  //     loader.setDRACOLoader(dracoLoader)
  // })

export default function Experience() {
  const { camera, gl, scene } = useThree();
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
        value: 0,
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
        value: 0,
        min: 0,
        max: 10,
        step: 0.001
    },
    thickness: {
        value: 0,
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
      {/* Wobble sphere */}
      <mesh ref={wobble}
        receiveShadow={true}
        castShadow={true}
      >
        <directionalLight 
        castShadow={true}
        shadow={{ mapSize: [1024, 1024], 
                  camera: { far: 15 },
                  normalBias: 0.05
        }}
        position={[0.25, 2, -2.25]}
        />
        <meshPhysicalMaterial
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
      
      <mesh ref={plane} 
        receiveShadow={true} 
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
