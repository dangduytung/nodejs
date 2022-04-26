const MEGA_6_45_MIN = 1;
const MEGA_6_45_MAX = 45;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRndMega_6_45() {
    return getRndInteger(MEGA_6_45_MIN, MEGA_6_45_MAX);
}

console.log(getRndMega_6_45());