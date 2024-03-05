const handContainer = document.querySelector('.handContainer');
const image = document.querySelector('.fitImg');
const handleRight = document.querySelector('.handleRight');
const handleBottom = document.querySelector('.handleBottom');
const horizontalRatioInput = document.getElementById('horizontalRatio');
const verticalRatioInput = document.getElementById('verticalRatio');
const desiXInput = document.getElementById('desiX');
const desiYInput = document.getElementById('desiY');
const desiZInput = document.getElementById('desiZ');
const coefXInput = document.getElementById('coefX');
const coefYInput = document.getElementById('coefY');
const defaultPxH = 660;
const defaultPxW = 355;

let monitorInch = 24.5;
let monitorResX = window.screen.width; //ascpect = needless
let monitorResY = window.screen.height;
let defaultHandH = 185; //initial
let defaultHandW = 100;
let deformX = defaultHandW; // store delta
let deformY = defaultHandH;
let zoom;

function monitorDetect() {
    if (monitorResX > monitorResY) {
        zoom = monitorResX / 1920;
        document.body.style.zoom = zoom;
        defaultHandH *= (monitorInch / 24.5);
        defaultHandW *= (monitorInch / 24.5);
    } else {
        zoom = monitorResY / 1920;
        document.body.style.zoom = zoom;
        defaultHandH *= (monitorInch / 24.5);
        defaultHandW *= (monitorInch / 24.5);
    }
    horizontalRatioInput.value = Math.trunc(defaultHandW * 10) / 10;
    verticalRatioInput.value = Math.trunc(defaultHandH * 10) / 10;
    calcdesired();
}

function calcdesired() {
    desiXInput.value = Math.trunc(horizontalRatioInput.value * coefXInput.value * 10) / 10;
    desiYInput.value = Math.trunc(verticalRatioInput.value * coefYInput.value * 10) / 10;
}

monitorDetect();

const inchInp = document.getElementById('monitorInch');
inchInp.value = monitorInch;
inchInp.addEventListener('input', function () {
    monitorInch = inchInp.value;
    console.log(monitorInch);
    horizontalRatioInput.value = Math.trunc(deformX * 10 * monitorInch / 24.5) / 10;
    verticalRatioInput.value = Math.trunc(deformY * 10 * monitorInch / 24.5) / 10;
    calcdesired();
});
// const resXInp = document.getElementById('resX');
// resXInp.value = monitorResX;
// resXInp.addEventListener('input', function () {
//     monitorResX = resXInp.value;
//     calcHandSize();
// });
// const resYInp = document.getElementById('resY');
// resYInp.value = monitorResY;
// resYInp.addEventListener('input', function () {
//     monitorResY = resYInp.value;
//     calcHandSize();
// });
horizontalRatioInput.addEventListener('input', function () {
    calcdesired();
});
verticalRatioInput.addEventListener('input', function () {
    calcdesired();
});
coefXInput.addEventListener('input', function () {
    calcdesired();
});
coefYInput.addEventListener('input', function () {
    calcdesired();
});

let startWidth, startHeight, startX, startY, storeX, storeY;

handleRight.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startWidth = image.clientWidth;
    startX = e.clientX;
    document.addEventListener('mousemove', resizeWidth);
    document.addEventListener('mouseup', stopResizeWidth);
});

handleBottom.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startHeight = image.clientHeight;
    startY = e.clientY;
    document.addEventListener('mousemove', resizeHeight);
    document.addEventListener('mouseup', stopResizeHeight);
});

function resizeWidth(e) {
    const width = startWidth - e.clientX + startX;
    // const horizontalRatio = width / startWidth;
    image.style.width = width + 'px';
    deformX = defaultHandW * (image.clientWidth / defaultPxW);
    horizontalRatioInput.value = Math.trunc(deformX * 10) / 10;
    desiXInput.value = Math.trunc(deformX * coefXInput.value * 10) / 10;
}

function stopResizeWidth() {
    document.removeEventListener('mousemove', resizeWidth);
}

function resizeHeight(e) {
    const height = startHeight + e.clientY - startY;
    // const verticalRatio = height / startHeight;
    image.style.height = height + 'px';
    deformY = defaultHandH * (image.clientHeight / defaultPxH)
    verticalRatioInput.value = Math.trunc(deformY * 10) / 10;
    desiYInput.value = Math.trunc(deformY * coefYInput.value * 10) / 10;
}

function stopResizeHeight() {
    document.removeEventListener('mousemove', resizeHeight);
}

document.getElementById('desiMouse').addEventListener('submit', function (event) {
    event.preventDefault();
    const url = `/desiMouse?desiX=${desiXInput.value}&desiY=${desiYInput.value}&desiZ=${desiZInput.value || 'null'}`
    window.location.href = url;
});