AFRAME.registerComponent("log", {
  init: function () {
    var debugtxt = document.querySelector("a-text");
    debugtxt.setAttribute("value", "goodnite");
  },
});

AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],

  init: function () {
    console.log("ok collider check");
    var debugtxt = document.querySelector("a-text");

    this.el.addEventListener("raycaster-intersection", function (e) {
      //-- get selected object
      this.selectedObj = e.detail.els[0];
      //debugtxt.setAttribute("value", "Tocaste un objeto!");
    });

    this.el.addEventListener("raycaster-intersection-cleared", function (e) {
      //-- get selected object
      this.selectedObj = null;
    });

    //-- grip button pressed
    this.el.addEventListener("gripdown", function (e) {
      this.grip = true;
      debugtxt.setAttribute("value", "Agarre presionado");
    });

    //-- grip button released
    this.el.addEventListener("gripup", function (e) {
      this.grip = false;
      debugtxt.setAttribute("value", "Agarre liberado");
    });

    //-- trigger button pressed
    this.el.addEventListener("triggerdown", function (e) {
      debugtxt.setAttribute("value", "Gatillo presionado");

      if (!this.selectedObj) return;

      debugtxt.setAttribute("value", this.selectedObj.id);
      this.selectedObj.parentNode.removeChild(this.selectedObj);
    });
  },

  tick: function () {
    if (!this.el.selectedObj) return;
    if (!this.el.grip) return;

    var raycast = this.el.getAttribute("raycaster").direction;

    var pos = new THREE.Vector3(raycast.x, raycast.y, raycast.z);
    pos.normalize();

    //-- final destination of object will be 2m in front of ray
    pos.multiplyScalar(3);

    //-- convert to world coordinate
    this.el.object3D.localToWorld(pos);

    //Move selected object to follow the tip of raycaster.
    this.el.selectedObj.object3D.position.set(pos.x, pos.y, pos.z);

    if (this.el.selectedObj.components["dynamic-body"]) {
      this.el.selectedObj.components["dynamic-body"].syncToPhysics();
    }
  },
});

AFRAME.registerComponent("thumbstick-logging", {
  init: function () {
    this.el.addEventListener("thumbstickmoved", this.logThumbstick);
  },
  logThumbstick: function (evt) {
    var debugtxt = document.querySelector("a-text");
    var cameraRig = document.querySelector("#cameraRig");

    if (evt.detail.y > 0.95) {
      //debugtxt.setAttribute("value", "DOWN");
      cameraRig.object3D.translateZ(0.05);
    }
    if (evt.detail.y < -0.95) {
      //debugtxt.setAttribute("value", "UP");
      cameraRig.object3D.translateZ(-0.05);
    }
    if (evt.detail.x < -0.95) {
      debugtxt.setAttribute("value", "LEFT");
      cameraRig.object3D.rotateY(THREE.Math.degToRad(5));
    }
    if (evt.detail.x > 0.95) {
      debugtxt.setAttribute("value", "RIGHT");
      cameraRig.object3D.rotateY(THREE.Math.degToRad(-5));
    }
  },
});
