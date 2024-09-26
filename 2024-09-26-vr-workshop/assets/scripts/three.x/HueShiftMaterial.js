import * as THREE from 'three';

class HueShiftMaterial {
    constructor(texture, repeat, mappingMode, hue) {
        return new THREE.ShaderMaterial({
            uniforms: {
            texture1: { value: texture },
            hueShift: { value: hue },
            repeat: { value: repeat },
            mappingMode: { value: mappingMode },
            fogColor: { value: new THREE.Color(0xa1a1a1) },
            fogStart: { value: 200.0 },
            fogEnd: { value: 1000.0 },
            },
            vertexShader: `
                varying vec2 vUvOriginal;
                varying vec2 vUvRepeated;
                varying float vFogFactor;

                uniform vec2 repeat;
                uniform float fogStart;
                uniform float fogEnd;

                void main() {
                    vUvOriginal = uv;
                    vUvRepeated = uv * repeat;

                    // Compute world position
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

                    // Calculate fog factor
                    float dist = length(worldPosition.xyz);
                    vFogFactor = smoothstep(fogStart, fogEnd, dist);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D texture1;
                uniform float hueShift;
                uniform vec3 fogColor;
                uniform float mappingMode;

                varying vec2 vUvOriginal;
                varying vec2 vUvRepeated;
                varying float vFogFactor;

                vec3 rgb2hsv(vec3 c) {
                    // RGB to HSV conversion
                    vec4 K = vec4(0.0, -1.0 / 6.0, 1.0 / 3.0, 2.0 / 3.0);
                    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                    float d = q.x - min(q.w, q.y);
                    float e = 1.0e-10;
                    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
                }

                vec3 hsv2rgb(vec3 c) {
                    // HSV to RGB conversion
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                void main() {
                    // Select UVs based on mappingMode
                    vec2 uvToUse = mix(vUvOriginal, vUvRepeated, mappingMode);
                    vec4 color = texture2D(texture1, uvToUse);

                    // Apply hue shift
                    vec3 hsv = rgb2hsv(color.rgb);
                    hsv.x += hueShift;
                    hsv.x = fract(hsv.x); // Wrap hue value between 0.0 and 1.0
                    vec3 finalColor = hsv2rgb(hsv);

                    // Apply fog effect
                    finalColor = mix(finalColor, fogColor, vFogFactor);

                    gl_FragColor = vec4(finalColor, color.a);
                }
            `,
        });
    }
}
export { HueShiftMaterial };