varying vec2 vUv;
varying float _height;
varying float _width;

float random (vec2 p) {
    p  = 50.0 * fract(p * 0.3183099 + vec2(0.1, 0.1));
    return fract(p.x * p.y);
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
    vec4 top = vec4(0.34510, 0.34510, 0.77647, 1.0);
    vec4 bottom = vec4(1.0, 0.425, 0.165, 1.0);
    vec4 col = vec4(0.0);

    col = mix(bottom, top, pow((y / 1.0), 1.5));


    return col;
}

vec4 sun(vec2 pos, inout vec4 col) {
    vec2 center = vec2(0.5* _width, 0.5333 * _height);
    float dist = distance(pos, center);

    if(_width > _height){
        if (dist < _width / 25.0) {
            col = vec4(1.0, 0.8, 0.65, 1.0);
        }
        if (dist > _width / 25.0 && dist < _width / 4.0) {
            col = mix(vec4(1.0, 0.45, 0.05, 1.0), col, pow((dist) / (_width / 4.0), 1.0));
        }
    } else {
        if (dist < _height / 25.0) {
            col = vec4(1.0, 0.8, 0.65, 1.0);
        }
        if (dist > _height / 25.0 && dist < _height / 4.0) {
            col = mix(vec4(1.0, 0.45, 0.05, 1.0), col, pow((dist) / (_height / 4.0), 1.0));
        }
    }

    return col;
}

bool isInsideTriangle(vec2 pt, vec2 v_1, vec2 v_2, vec2 v3) {
    vec2 v0 = v3 - v_1;
    vec2 v1 = v_2 - v_1;
    vec2 v2 = pt - v_1;

    float dot00 = dot(v0, v0);
    float dot01 = dot(v0, v1);
    float dot02 = dot(v0, v2);
    float dot11 = dot(v1, v1);
    float dot12 = dot(v1, v2);

    float invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
    float u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    float v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0.0) && (v >= 0.0) && (u + v < 1.0);
}

float pointLineDistance(vec2 a, vec2 b, vec2 p, inout vec2 p2) {
    vec2 lineVec = b - a;
    vec2 pointVec = p - a;
    
    float lineLen = length(lineVec);
    vec2 lineUnitVec = lineVec / lineLen;

    // Project point onto the line
    float projectedLength = dot(pointVec, lineUnitVec);
    vec2 closestPoint;
    if (projectedLength < 0.0) {
        // Before segment
        closestPoint = a;
    } else if (projectedLength > lineLen) {
        // After segment
        closestPoint = b;
    } else {
        // On segment
        closestPoint = a + lineUnitVec * projectedLength;
    }

    // Distance from point to the closest point on the line
    p2 = closestPoint;
    return length(p - closestPoint);
}

vec4 trees(vec2 pos, inout vec4 col, float h, float seed, float size){
    float d = 0.0;
    float nd = 0.0;

    if(_width > _height){
        d = _width;
        nd = _height;
    } else {
        d = _height;
        nd = _width;
    }


    for (float i = 0.0; i < (1.0/size) * 10.0; i+=1.0) {
        float heightOffset = noise(vec2(seed, i)) * h / 2.0;
        vec2 treePos = vec2(noise(vec2(i, seed)), h /2.0 + heightOffset);
        treePos = treePos * vec2(_width, 1.0);

        vec2 a = treePos + vec2(0.0, 500.0 * size);
        vec2 b = treePos + vec2(-150.0 * size, 0.0);
        vec2 c = treePos + vec2(150.0 * size, 0.0);

        vec2 noisyEdgeAB = mix(a, b, noise(pos));
        vec2 noisyEdgeBC = mix(b, c, noise(pos));
        vec2 noisyEdgeCA = mix(c, a, noise(pos));

        vec2 p = vec2(0.0);
        float dist = pointLineDistance(a, b, pos, p);
        float n = noise(p / _width * 250.0);

        vec2 p2 = vec2(0.0);
        float dist2 = pointLineDistance(a, c, pos, p2);
        float n2 = noise(p2 / _width * 250.0);

        vec2 centerPos = vec2(0.0);
        float centerDist = pointLineDistance(a, treePos, pos, centerPos);

        if (isInsideTriangle(pos, a, b, c)) {
            n *= centerDist;
            n2 *= centerDist;
            if(dist < 10.0 + n || dist2 < 10.0 + n2){
                // col = vec4(0.05, 0.05, 0.05, 1.0);
            } else {
                col = vec4(0.15, 0.15, 0.05, 1.0);
    
                vec2 sun = vec2(0.5* _width, 0.5333 * _height);
                float sunDist = distance(pos, sun);
                
                float distP = distance(pos, centerPos) / distance(p, centerPos);
                float distP2 = distance(pos, centerPos) / distance(p2, centerPos);

                if(distP < 50.0 || distP < 50.0){
                    // col = mix(col, vec4(1.0, 0.45, 0.15, 1.0), distP);
                }
            }

            
        }

        float width = 25.0 * size;

        if(pos.x < treePos.x + width && pos.x > treePos.x - width && pos.y < treePos.y && pos.y > treePos.y - width * 2.0){
            col = vec4(0.1, 0.05, 0.0, 1.0);
        }

        
    }

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

        if(dist < 250.0){
            col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 250.0, 1.0));
        }
    }

    float n1 = noise(vec2(pos.x/d, 1.0)) / 2.0;
    n1 += noise(vec2(pos.x/d * 8.0, 1.0)) / 4.0;
    n1 += noise(vec2(pos.x/d * 16.0, 1.0)) / 8.0;
    n1 += noise(vec2(pos.x/d * 128.0, 1.0)) / 64.0;
    float h1 = (_height/2.0) * n1 + (_height/6.0);
    if (pos.y < h1){
        col = vec4(0.15, 0.15, 0.15, 1.0);

        vec2 center = vec2(0.5* _width, 0.5 * _height) ;
        float dist = distance(pos, center);

        if(dist < 500.0){
            col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 500.0, 0.25));
        }
    }

    // col = trees(pos, col, h1, 1.0, 0.25);

    float n2 = noise(vec2(pos.x/d, 2.0)) / 2.0;
    n2 += noise(vec2(pos.x/d * 8.0, 2.0)) / 4.0;
    n2 += noise(vec2(pos.x/d * 16.0, 2.0)) / 8.0;
    n2 += noise(vec2(pos.x/d * 128.0, 2.0)) / 64.0;
    float h2 = (_height/4.0) * n2 + (_height/12.0);
    if (pos.y < h2){
        col = vec4(0.1, 0.1, 0.1, 1.0);

        vec2 center = vec2(0.5* _width, 0.5 * _height) ;
        float dist = distance(pos, center);

        if(dist < 1000.0){
            col = mix(vec4(1.0, 0.45, 0.15, 1.0), col, pow((dist)/ 1000.0, 0.125));
        }
    }

    // col = trees(pos, col, h2, 2.0, 1.0);

    return col;
}

void main() {
    vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 pos = vec2(vUv.x * _width, vUv.y * _height);
    col = backgroundGradient(vUv.x, vUv.y);
    col = sun(pos, col);
    col = mountains(pos, col);

    gl_FragColor = (col);
}