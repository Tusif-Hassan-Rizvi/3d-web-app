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

    // create a sphere Moon
    const geometry = new THREE.SphereGeometry(4, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      // color: "#00ff83",
      roughness: 1,
      map: new THREE.TextureLoader().load("./Moon8K.jpg"),
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // size
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // add background on scece
    const spaceTexture = new THREE.TextureLoader().load("./Space.jpg");
    scene.background = spaceTexture;

    //light
    // ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    //pointlight
    // const positionlight = new THREE.PointLight(0xffffff, 1, 100);
    // positionlight.position.set(30, 0, 0);
    // scene.add(positionlight);

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
    controls.enablePan = false; //true/false
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;

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
  }, []);

  return( <canvas className={style.canvasBox} ref={canvasRef} />)
}
