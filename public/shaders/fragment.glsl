varying vec2 vUv;
varying float _height;
varying float _width;

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
    vec4 bottom = vec4(0.992, 0.55, 0.165, 1.0);

    vec4 col = mix(bottom, top, pow(y/1.0, 5.0));

    return col;
}

vec4 sun(vec2 pos, inout vec4 col) {
    vec2 center = vec2(0.5* _width, 0.5 * _height);
    float dist = distance(pos, center);

    if(_width > _height){
        if (dist < _width / 25.0) {
                col = vec4(1.0, 0.8, 0.65, 1.0);
        }
    } else {
        if (dist < _height / 25.0) {
                col = vec4(1.0, 0.8, 0.65, 1.0);
        }
    }
    

    // if (dist > 0.1 && dist < 1.0) {
    //     col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist), 1.0));
    // }

    return col;
}

vec4 mountains(vec2 pos, inout vec4 col) {
    float d = 0.0;
    float nd = 0.0;

    if(_width > _height){
        d = _width;
        nd = _height;
    } else {
        d = _height;
        nd = _width;
    }

    float n = noise(vec2(pos.x/d, 0.0)) / 2.0;
    n += noise(vec2(pos.x/d * 8.0, 0.0)) / 4.0;
    n += noise(vec2(pos.x/d * 16.0, 0.0)) / 8.0;
    n += noise(vec2(pos.x/d * 128.0, 0.0)) / 64.0;

    if (pos.y < (_height/2.0) * n + (_height/3.0)){
        col = mix(vec4(0.25, 0.25, 0.25, 1.0), vec4(1.0, 0.45, 0.15, 1.0), 0.25);

        vec2 center = vec2(0.5* _width, 0.5 * _height) ;
        float dist = distance(pos, center);

        // if(dist < 250.0){
        //     col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 250.0, 1.0));
        // }
    }

    float n1 = noise(vec2(pos.x/d, 1.0)) / 2.0;
    n1 += noise(vec2(pos.x/d * 8.0, 1.0)) / 4.0;
    n1 += noise(vec2(pos.x/d * 16.0, 1.0)) / 8.0;
    n1 += noise(vec2(pos.x/d * 128.0, 1.0)) / 64.0;

    if (pos.y < (_height/2.0) * n1 + (_height/6.0)){
        col = vec4(0.15, 0.15, 0.15, 1.0);

        vec2 center = vec2(0.5* _width, 0.5 * _height) ;
        float dist = distance(pos, center);

        // if(dist < 500.0){
        //     col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 500.0, 0.5));
        // }
    }

    float n2 = noise(vec2(pos.x/d, 2.0)) / 2.0;
    n2 += noise(vec2(pos.x/d * 8.0, 2.0)) / 4.0;
    n2 += noise(vec2(pos.x/d * 16.0, 2.0)) / 8.0;
    n2 += noise(vec2(pos.x/d * 128.0, 2.0)) / 64.0;

    if (pos.y < (_height/4.0) * n2 + (_height/12.0)){
        col = vec4(0.1, 0.1, 0.1, 1.0);

        vec2 center = vec2(0.5* _width, 0.5 * _height) ;
        float dist = distance(pos, center);

        // if(dist < 1000.0){
        //     col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 1000.0, 0.25));
        // }
    }


    return col;
}

vec4 trees(vec2 pos, inout vec4 col){
    // if(pos.y % 2.0 == 0){
    //     col = vec4(1.0, 1.0, 1.0, 1.0);
    // }
    return col;
}

void main() {
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pos = vec2(vUv.x * _width, vUv.y * _height);
    col = backgroundGradient(vUv.x, vUv.y);
    col = sun(pos, col);
    col = mountains(pos, col);
    col = trees(pos, col);

    gl_FragColor = (col);
}