function hexToRGB(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r /= 255;
    g /= 255;
    b /= 255;
    return [r, g, b];
}
export { hexToRGB };