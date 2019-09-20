import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";

class Scene extends Component {
  render() {
    return <div id="three" />;
  }

  componentDidMount() {
    const width = 200;
    const height = width;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(width, height);
    renderer.setClearColor("0xffffff", 1.0);

    const dom = document.getElementById("three");
    dom.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0;

    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshLambertMaterial({
      color: "red"
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    const light_a = new THREE.AmbientLight(0x333333);
    scene.add(light_a);

    const animate = function() {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
    };

    animate();

    this.cube = cube;
  }

  shouldComponentUpdate() {
    return false;
  }

  // componentWillReceiveProps(nextProps) {
  componentDidUpdate(nextProps) {
    if (this.props.color !== nextProps.color) {
      this.cube.material.color.setHex(nextProps.color);
    }
  }
}

export default Scene;
