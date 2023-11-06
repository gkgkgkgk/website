varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec4 backgroundGradient(float x, float y) {
    vec4 top = vec4(0.027, 0.494, 0.627, 1.0);
    vec4 bottom = vec4(0.992, 0.722, 0.365, 1.0);

    vec4 col = mix(bottom, top, y/1.0);

    return col;
}

vec4 mountains(float x, float y, inout vec4 col) {
    float n = pow(noise(vec2(x * 5.0, 0.0)), 2.0);
    n += noise(vec2(x * 10.0, 0.0)) / 5.0;
    n += noise(vec2(x * 75.0, 0.0)) / 25.0;
    
    if (y < n){
        col = vec4(y*0.5, 0.5-y, 0.15, 1.0);
    }

    // float n1 = noise(vec2((x + 0.25) * 5.0, 0.0)) / 3.0;
    // n1 += noise(vec2((x + 0.25) * 10.0, 0.0)) / 3.0;
    // n1 += noise(vec2((x + 0.25) * 75.0, 0.0)) / 25.0;
    
    // if (y < n1 - 0.15){
    //     col = vec4(y, y, 0.15, 1.0);
    // }

    return col;
}

void main() {
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

    col = backgroundGradient(vUv.x, vUv.y);
    col = mountains(vUv.x, vUv.y, col);

    gl_FragColor = (col);
}