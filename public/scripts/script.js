let currentColor = "black";
let socket = io();
let bg = 220;
let id;
let drawRect = false;
let drawCircle = false;
let drawLine = false;
let lineBtn = document.getElementById("lineBtn");
let circleBtn = document.getElementById("circleBtn");
let rectBtn = document.getElementById("rectBtn");
let penBtn = document.getElementById("penBtn");

lineBtn.addEventListener("click", function () {
  drawLine = !drawLine;
  if (drawLine) {
    document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    lineBtn.classList.add("active");
  } else {
    document.getElementsByTagName("canvas")[0].style.cursor = "default";
    lineBtn.classList.remove("active");
  }
  drawCircle = false;
  drawRect = false;
  circleBtn.classList.remove("active");
  rectBtn.classList.remove("active");
});

penBtn.addEventListener("click", function () {
  drawLine = false;
  drawCircle = false;
  drawRect = false;
  lineBtn.classList.remove("active");
  circleBtn.classList.remove("active");
  rectBtn.classList.remove("active");
  document.getElementsByTagName("canvas")[0].style.cursor = "default";
});

circleBtn.addEventListener("click", function () {
  drawCircle = !drawCircle;
  if (drawCircle) {
    document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    circleBtn.classList.add("active");
  } else {
    document.getElementsByTagName("canvas")[0].style.cursor = "default";
    circleBtn.classList.remove("active");
  }
  drawLine = false;
  drawRect = false;
  lineBtn.classList.remove("active");
  rectBtn.classList.remove("active");
});

rectBtn.addEventListener("click", function () {
  drawRect = !drawRect;
  if (drawRect) {
    document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    rectBtn.classList.add("active");
  } else {
    document.getElementsByTagName("canvas")[0].style.cursor = "default";
    rectBtn.classList.remove("active");
  }
  drawLine = false;
  drawCircle = false;
  lineBtn.classList.remove("active");
  circleBtn.classList.remove("active");
});

function setup() {
  //create full size canvas
  createCanvas(innerWidth, 650);
  background(bg);
  strokeWeight(2);
  id = new URL(window.location.href).pathname.substring(7);
  socket.emit("join-room", id);
}

document.getElementById("clearcan").addEventListener("click", function () {
  background(bg);
  socket.emit("chat message", id, {
    message: "clear",
  });
});

document.getElementById("redcl").addEventListener("click", function () {
  currentColor = "red";
  socket.emit("chat message", id, {
    message: "red",
  });
});

document.getElementById("greencl").addEventListener("click", function () {
  currentColor = "green";
  socket.emit("chat message", id, {
    message: "green",
  });
});

document.getElementById("bluecl").addEventListener("click", function () {
  currentColor = "blue";
  socket.emit("chat message", id, {
    message: "blue",
  });
});

document.getElementById("blackcl").addEventListener("click", function () {
  currentColor = "black";
  socket.emit("chat message", id, {
    message: "black",
  });
});

let startX;
let startY;

let endX;
let endY;

function mousePressed() {
  startX = mouseX;
  startY = mouseY;
}

function mouseDragged() {
  endX = mouseX;
  endY = mouseY;

  // strokeWeight(1);
  // //draw an outline of the shape and then remove it
  // if (drawRect) {
  //   noFill();
  //   stroke(currentColor);
  //   rect(startX, startY, endX - startX, endY - startY);

  //   //clear the rect
  // }
  // if (drawCircle) {
  //   noFill();
  //   stroke(currentColor);
  //   ellipse(startX, startY, endX - startX, endY - startY);
  // }
  // if (drawLine) {
  //   stroke(currentColor);
  //   line(startX, startY, endX, endY);
  // }
}

function mouseReleased() {
  endX = mouseX;
  endY = mouseY;
  if (drawRect) {
    noFill();
    rect(startX, startY, endX - startX, endY - startY);

    socket.emit("chat message", id, {
      message: "rect",
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      drawRect,
      currentColor,
    });
  } else if (drawCircle) {
    noFill();
    ellipse(startX, startY, endX - startX, endY - startY);

    socket.emit("chat message", id, {
      message: "circle",
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      drawCircle,
      currentColor,
    });
  } else if (drawLine) {
    line(startX, startY, endX, endY);

    socket.emit("chat message", id, {
      message: "line",
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      drawLine,
      currentColor,
    });
  }
}

function draw() {
  //make the button can switch the color
  if (mouseIsPressed == true) {
    stroke(currentColor);

    if (!drawRect && !drawCircle && !drawLine) {
      strokeCap(ROUND);
      line(mouseX, mouseY, pmouseX, pmouseY);
      socket.emit("chat message", id, {
        mouseX: mouseX,
        mouseY: mouseY,
        pmouseX: pmouseX,
        pmouseY: pmouseY,
        currentColor: currentColor,
      });
    }
  }
}

socket.on("chat message", function (msg) {
  if (msg.message === "clear") {
    background(bg);
  } else if (msg.message === "red") {
    currentColor = "red";
  } else if (msg.message === "green") {
    currentColor = "green";
  } else if (msg.message === "blue") {
    currentColor = "blue";
  } else if (msg.message === "black") {
    currentColor = "black";
  } else if (msg.message === "rect") {
    noFill();
    // drawRect = msg.drawRect;
    stroke(msg.currentColor);
    rect(msg.startX, msg.startY, msg.endX - msg.startX, msg.endY - msg.startY);
  } else if (msg.message === "circle") {
    noFill();
    // drawCircle = msg.drawCircle;
    stroke(msg.currentColor);
    ellipse(
      msg.startX,
      msg.startY,
      msg.endX - msg.startX,
      msg.endY - msg.startY
    );
  } else if (msg.message === "line") {
    // drawLine = msg.drawLine;
    stroke(msg.currentColor);
    line(msg.startX, msg.startY, msg.endX, msg.endY);
  } else {
    stroke(msg.currentColor);
    line(msg.mouseX, msg.mouseY, msg.pmouseX, msg.pmouseY);
  }
});

function keyPressed() {
  if (key == "s") {
    saveCanvas("myart.png");
  } else if (key == "r") {
    drawRect = !drawRect;
    if (drawRect) {
      document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    } else {
      document.getElementsByTagName("canvas")[0].style.cursor = "default";
    }
    drawCircle = false;
  } else if (key == "c") {
    drawCircle = !drawCircle;
    if (drawCircle) {
      document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    } else {
      document.getElementsByTagName("canvas")[0].style.cursor = "default";
    }
    drawRect = false;
  } else if (key == "l") {
    drawLine = !drawLine;
    if (drawLine) {
      document.getElementsByTagName("canvas")[0].style.cursor = "crosshair";
    } else {
      document.getElementsByTagName("canvas")[0].style.cursor = "default";
    }
    drawCircle = false;
    drawRect = false;
  }
}
