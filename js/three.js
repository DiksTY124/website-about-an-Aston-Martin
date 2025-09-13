import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper';
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';


function init() {
    let container = document.querySelector('.container');

    //Scene
    const scene = new THREE.Scene();
    
    //Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(-8, 3, 5);

    //render
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true  // Это делает сцену прозрачной
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    let plain;
    {
        plain = new THREE.Mesh(
            new THREE.PlaneGeometry(0, 0),
            new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0
            })
        );
        plain.receiveShadow = true;
        plain.position.set(0, -1, 0);
        plain.rotateX(-Math.PI / 2);
        scene.add(plain);
    }

    // Model
    {
        const loader = new GLTFLoader();
        loader.load('../model/scene.gltf', gltf => {
            scene.add(gltf.scene);
        }, 
            function (error) {
                console.log('Error: ' + error);
            }
        );
    }
    
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-2, 0, 10);
        light.lookAt(0, -1, 0);
        scene.add(light);
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(2, 0, 5);
        light.lookAt(0, 1, 0);
        scene.add(light);
    }

    RectAreaLightUniformsLib.init();
    {
        const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
        rectLight.position.set(-10, 0, 0);
        rectLight.rotation.y = Math.PI + Math.PI/4;
        scene.add(rectLight);
    }

    {
        const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
        rectLight.position.set(10, 0, 0);
        rectLight.rotation.y = Math.PI - Math.PI/4;
        scene.add(rectLight);
    }
    
    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enableDamping = true;

    //Resize
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animate
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

init();