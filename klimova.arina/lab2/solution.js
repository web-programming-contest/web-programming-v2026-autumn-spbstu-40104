export function hexToRgb(hex) {
    let red = parseInt(hex.slice(1, 3), 16);
    let green = parseInt(hex.slice(3, 5), 16);
    let blue = parseInt(hex.slice(5, 7), 16);

    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

