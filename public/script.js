let currentColor = "black";
let socket = io();
let bg = 220;

function setup() {
  //create full size canvas
  createCanvas(innerWidth, 600);
  background(bg);
  strokeWeight(5);
}

document.getElementById("clearcan").addEventListener("click", function () {
  background(bg);
  socket.emit("chat message", {
    message: "clear",
  });
});

document.getElementById("redcl").addEventListener("click", function () {
  currentColor = "red";
  socket.emit("chat message", {
    message: "red",
  });
});

document.getElementById("greencl").addEventListener("click", function () {
  currentColor = "green";
  socket.emit("chat message", {
    message: "green",
  });
});

document.getElementById("bluecl").addEventListener("click", function () {
  currentColor = "blue";
  socket.emit("chat message", {
    message: "blue",
  });
});

document.getElementById("blackcl").addEventListener("click", function () {
  currentColor = "black";
  socket.emit("chat message", {
    message: "black",
  });
});

function draw() {
  //make the button can switch the color
  if (mouseIsPressed == true) {
    stroke(currentColor);
    line(mouseX, mouseY, pmouseX, pmouseY);
    socket.emit("chat message", {
      mouseX: mouseX,
      mouseY: mouseY,
      pmouseX: pmouseX,
      pmouseY: pmouseY,
      currentColor: currentColor,
    });
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
  } else {
    stroke(msg.currentColor);
    line(msg.mouseX, msg.mouseY, msg.pmouseX, msg.pmouseY);
  }
});

function keyPressed() {
  if (key == "s") {
    saveCanvas("myart.png");
  }
}
