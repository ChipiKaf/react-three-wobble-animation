import * as THREE from 'three'
export const createControlConfig = (uniforms) => {
  const config = {};
  Object.keys(uniforms).forEach((name) => {
    const value = uniforms[name].value;
    if (typeof value === "number") {
      config[name] = {
        value,
        min: 0,
        max: 2,
        step: 0.001,
      };
    } else if (value instanceof THREE.Color) {
      config[name] = {
        value: `#${value.getHexString()}`,
      };
    } else {
      config[name] = { value };
    }
  });
  return config;
};
