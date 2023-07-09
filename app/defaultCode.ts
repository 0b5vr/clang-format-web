export const defaultCode = `#version 300 es

precision highp float;

in vec2 vUv;

out vec4 fragColor;

void main(){
  float len=length(vUv-.5);
  float shape=smoothstep(.5,.4,len);
  fragColor=vec4(vec3(shape),1.);
}
`;
