varying vec2 vUv;
uniform float u_aspectRatio;
out float ratio;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
    ratio = u_aspectRatio;
}