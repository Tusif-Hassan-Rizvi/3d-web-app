import React from "react";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LightProbeHelper } from "three/addons/helpers/LightProbeHelper.js";
import gsap from "gsap";
import * as THREE from "three";
import style from "../styles/moon.module.css";

export default function Moon() {
  const canvasRef = useRef();

  useEffect(() => {
    // create a scene
    const scene = new THREE.Scene();

    // create a sphere
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: "#00ff83",
      roughness:0.5
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // size
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //light
    //pointlight
    const positionlight = new THREE.PointLight(0xffffff, 1, 100);
    positionlight.position.set(10, 2, 0);
    positionlight.intensity = 1.5;
    scene.add(positionlight);

    // pointLightHelper
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(
    //   positionlight,
    //   sphereSize
    // );
    // scene.add(pointLightHelper);

    //camera
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.5,
      100
    );
    camera.position.z = 20;
    scene.add(camera);

    //rendered
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    //controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;  //true/false
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;

    //Resize
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      //update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    });

    // creating a loop
    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(loop);
    };
    loop();

    //timeline
    const tl = gsap.timeline({ default: { duration: 1 } });
    tl.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

    // mouse animation color
    let MouseDown = false;
    let rgb = [];
    window.addEventListener("mousedown", () => (MouseDown = true));
    window.addEventListener("mouseup", () => (MouseDown = true));

    window.addEventListener("mousemove", (e) => {
      if (MouseDown) {
        rgb = [
          Math.round((e.pageX / sizes.width) * 255),
          Math.round((e.pageY / sizes.height) * 255),
          150,
        ];

        // animation
        let newcolor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(sphere.material.color, {
          r: newcolor.r,
          g: newcolor.g,
          b: newcolor.b,
        });
      }
    });
  });

  return <canvas className={style.canvasBox} ref={canvasRef} />;
}
