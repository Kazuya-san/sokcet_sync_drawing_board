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
let drawings = [];
let offsetX = 0;
let offsetY = 0;

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

//disable right click context menu
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

function mouseDragged() {
  endX = mouseX;
  endY = mouseY;
  if (mouseButton === RIGHT) {
    offsetX += mouseX - pmouseX;
    offsetY += mouseY - pmouseY;
    socket.emit("chat message", id, {
      message: "offset",
      offset: {
        x: offsetX,
        y: offsetY,
      }
    });
    redrawCanvas();
  }
}

function mouseReleased() {
  endX = mouseX;
  endY = mouseY;


  if(mouseButton === LEFT){
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

    drawings.push({
      message: "rect",
      //account for offset
      startX: startX - offsetX,
      startY: startY - offsetY,
      endX: endX - offsetX,
      endY: endY - offsetY,

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

    drawings.push({
      message: "circle",
      //account for offset
      startX: startX - offsetX,
      startY: startY - offsetY,
      endX: endX - offsetX,
      endY: endY - offsetY,

      drawCircle,
      currentColor,
    });
  } else if (drawLine) {
    line(startX, startY, endX, endY);

    socket.emit("chat message", id, {
      message: "line2",
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      drawLine,
      currentColor,
    });
    drawings.push({
      message: "line2",
      mouseX: startX - offsetX,
      mouseY: startY - offsetY,
      pmouseX: endX - offsetX,
      pmouseY: endY - offsetY,

      drawLine,
      currentColor,
    });
    }
    socket.emit("chat message", id, {
    message: "drawings",
    drawings: drawings,
  });
  }
}

function draw() {
  if (mouseIsPressed == true && mouseButton === LEFT) {
    stroke(currentColor);

    if (!drawRect && !drawCircle && !drawLine) {
      strokeCap(ROUND);
      line(mouseX, mouseY, pmouseX, pmouseY);
      drawings.push({
        message: "line",
        mouseX: mouseX - offsetX,
        mouseY: mouseY - offsetY,
        pmouseX: pmouseX - offsetX,
        pmouseY: pmouseY - offsetY,
        currentColor: currentColor,
      });
   
      socket.emit("chat message", id, {
        mouseX: mouseX,
        mouseY: mouseY,
        pmouseX: pmouseX,
        pmouseY: pmouseY,
        currentColor: currentColor,
      });

      socket.emit("chat message", id, {
        message: "drawings",
        drawings: drawings,
      });
    }

    }
}
function redrawCanvas() {
  push();
  
  translate(offsetX, offsetY);
  background(bg);

  for (let i = 0; i < drawings.length; i++) {
    const currentDrawing = drawings[i];

    if (currentDrawing.message === "line" || currentDrawing.message === "line2") {
      stroke(currentDrawing.currentColor);
      line(currentDrawing.mouseX, currentDrawing.mouseY, currentDrawing.pmouseX, currentDrawing.pmouseY);
    } else if (currentDrawing.message === "rect") {
      noFill();
      stroke(currentDrawing.currentColor);
      rect(currentDrawing.startX, currentDrawing.startY, currentDrawing.endX - currentDrawing.startX, currentDrawing.endY - currentDrawing.startY);
    } else if (currentDrawing.message === "circle") {
      noFill();
      stroke(currentDrawing.currentColor);
      ellipse(currentDrawing.startX, currentDrawing.startY, currentDrawing.endX - currentDrawing.startX, currentDrawing.endY - currentDrawing.startY);
    }
  }
  pop();
}
socket.on("chat message", function (msg) {
  if (msg.message === "clear") {
    background(bg);
    drawings = [];
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
  }
  else if (msg.message === "line2") {
    // drawLine = msg.drawLine;
    stroke(msg.currentColor);
    line(msg.startX, msg.startY, msg.endX, msg.endY);
  }
  
  else if (msg.message === "drawings") {
    drawings = msg.drawings;
    // redrawCanvas();
  }
  else if (msg.message === "offset") {
    offsetX = msg.offset.x;
    offsetY = msg.offset.y;
    redrawCanvas();
  }
  else {
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
window.addEventListener("resize", (event) => {
  redrawCanvas();
});