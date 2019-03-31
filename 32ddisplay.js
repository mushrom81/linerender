let c = document.querySelector("canvas");
        
c.width = 500;
c.height = 250;
let halfHeight = c.height / 2;
let smallWidth = c.width / 3;
let smallHeight = c.height / 2.5;

let ctx = c.getContext("2d");

let vals = document.getElementById("vals");
let x = 0;
let y = 0;
let rotation = 0;

function moveOneInDir() {
    let rads = rotation * Math.PI / 180;
    let disY = Math.sin(rads);
    let disX = Math.cos(rads);
    x += Math.round(disX * 10000000000) / 10000000000;
    y += Math.round(disY * 10000000000) / 10000000000;
}

function rotate(degrees) {
    rotation += degrees;
    rotation = fixRotation(rotation);
}

function fixRotation(degrees) {
    while (degrees < 0) { degrees += 360; }
    while (degrees > 359) { degrees -= 360; }
    return degrees;
}

let keys = {};
onkeydown = onkeyup = function(e){
    e = e || window.event;
    if (e.key == "p") {
        points.push([x,y]);
    }
    keys[e.key] = (e.type == 'keydown');
}

function displayLineAndPoint(pointX, pointY) {
    let distanceX = pointX - x;
    let distanceY = pointY - y;
    let distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    let degreesFromZero = Math.atan2(distanceY, distanceX) * 180 / Math.PI;
    let degreesFromCOV = fixRotation(degreesFromZero - rotation);
    if (fixRotation(degreesFromCOV + 60) < 120) {
        drawLine(distance, fixRotation(degreesFromCOV + 60));
    }
    distanceInHex = toHex(distance * 2);
    ctx.strokeStyle = "#" + distanceInHex + distanceInHex + distanceInHex;
    drawPoint(distance, degreesFromCOV);
}

function toHex(int) {
    if (int > 255) { int = 255; }
    int = parseInt(int);
    let upperNible = 0
    while (int > 15) {
        int -= 16;
        upperNible++;
    }
    let nibleToHexArray = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    let HexString = nibleToHexArray[upperNible] + nibleToHexArray[int];
    return HexString;
}

function drawLine(distance, degrees) {
    distance = distance * 2
    if (distance > 125) { distance = 125; }
    ctx.beginPath();
    let distanceInHex = toHex(distance * 2);
    ctx.strokeStyle = "#" + distanceInHex + distanceInHex + distanceInHex;
    ctx.moveTo(c.width * degrees / 120, halfHeight + halfHeight / distance);
    ctx.lineTo(c.width * degrees / 120, halfHeight - halfHeight / distance);
    ctx.stroke();
}

function drawPoint(distance, degrees) {
    let rads = degrees * Math.PI / 180;
    let disX = Math.sin(rads) * distance;
    let disY = Math.cos(rads) * distance;
    ctx.beginPath();
    ctx.moveTo(c.width - (smallWidth / 2), (c.height - smallHeight / 2));
    ctx.lineTo(c.width - (smallWidth / 2) + disX, (c.height - smallHeight / 2) - disY);
    ctx.stroke();
}

let points = [[10,10],[10,20],[20,10],[20,20],[15,30]]

function loop() {
    requestAnimationFrame(loop);
    if (keys["w"]) {
        moveOneInDir();
    }
    if (keys["a"]) {
        rotation -= 3;
        rotation = fixRotation(rotation);
    }
    if (keys["s"]) {
        rotate(180);
        moveOneInDir();
        rotate(-180);
    }
    if (keys["d"]) {
        rotation += 3;
        rotation = fixRotation(rotation);
    }
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        displayLineAndPoint(point[0], point[1]);
    }  
    vals.innerHTML = "X:&nbsp;" + Math.round(x) + "&nbsp;Y:&nbsp;" + Math.round(y) + "&nbsp;Rotation:&nbsp;" + rotation + "&deg;";
}
loop();
