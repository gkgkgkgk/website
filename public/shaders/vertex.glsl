varying vec2 vUv;
uniform float height;
uniform float width;

out float _height;
out float _width;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
    _height = height;
    _width = width;
}