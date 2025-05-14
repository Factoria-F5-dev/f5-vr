AFRAME.registerComponent("collider-check", {
  init: function () {
    this.el.addEventListener("raycaster-intersection", (e) => {
      this.el.selectedObj = e.detail.els[0];
      this.el.selectedObj.setAttribute("color", "#00FF00"); // cambia a verde al seleccionar
    });

    this.el.addEventListener("raycaster-intersection-cleared", () => {
      if (this.el.selectedObj) {
        this.el.selectedObj.setAttribute("color", "red"); // vuelve al color original
      }
      this.el.selectedObj = null;
    });
  },
});

AFRAME.registerComponent("thumbstick-move", {
  init: function () {
    this.speed = 0.1;
    this.direction = new THREE.Vector3();

    this.el.addEventListener("thumbstickmoved", (e) => {
      this.direction.set(e.detail.x, 0, -e.detail.y);
      this.direction.multiplyScalar(this.speed);
      this.el.object3D.position.add(this.direction);
    });
  },
});

AFRAME.registerComponent("grab", {
  schema: { default: "" },
  init: function () {
    this.grip = false;

    this.el.addEventListener("gripdown", () => {
      this.grip = true;
    });

    this.el.addEventListener("gripup", () => {
      this.grip = false;
    });

    this.el.addEventListener("triggerdown", () => {
      if (this.el.selectedObj) {
        this.el.sceneEl.removeChild(this.el.selectedObj);
        this.el.selectedObj = null;
      }
    });
  },
  tick: function () {
    if (this.grip && this.el.selectedObj) {
      let obj = this.el.selectedObj.object3D;
      let controller = this.el.object3D;

      let targetPosition = new THREE.Vector3();
      controller.getWorldDirection(targetPosition);
      targetPosition.multiplyScalar(0.5); // distancia del objeto frente al controlador
      targetPosition.add(controller.getWorldPosition(new THREE.Vector3()));

      obj.position.lerp(targetPosition, 0.2); // movimiento suave
      obj.rotation.copy(controller.rotation);
    }
  },
});
