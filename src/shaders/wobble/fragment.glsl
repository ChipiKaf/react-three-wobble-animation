varying float vWobble;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main()
{
    float colorMix =  vWobble;
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    // Shiny tip
    csm_Roughness = 1.0 - colorMix;
}