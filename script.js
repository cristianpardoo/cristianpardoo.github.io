function setBackgroundColor() {
    const currentTime = new Date().getTime();
    const randomSeed = (currentTime % 1000) / 1000;
    const hue = randomSeed * 360;
    const saturation = 50 + randomSeed * 30;
    const lightness = 40 + randomSeed * 20;

    document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

setBackgroundColor();
