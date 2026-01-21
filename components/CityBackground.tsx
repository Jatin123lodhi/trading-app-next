"use client";
import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function CityBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneInitialized = useRef(false);
  const cleanupFn = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Wait for THREE to be available
    const initThreeJS = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window === 'undefined' || !(window as any).THREE || !mountRef.current || sceneInitialized.current) {
        return;
      }

      sceneInitialized.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const THREE = (window as any).THREE;

      // Three JS Template - BASIC parameters
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth > 800) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.needsUpdate = true;
      }

      mountRef.current.appendChild(renderer.domElement);

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize, false);

      const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
      camera.position.set(0, 2, 14);

      const scene = new THREE.Scene();
      const city = new THREE.Object3D();
      const smoke = new THREE.Object3D();
      const town = new THREE.Object3D();

      let createCarPos = true;
      const uSpeed = 0.001;

      // FOG background
      const setcolor = 0xF02050;
      scene.background = new THREE.Color(setcolor);
      scene.fog = new THREE.Fog(setcolor, 10, 16);

      // RANDOM Function
      function mathRandom(num = 8) {
        const numValue = -Math.random() * num + Math.random() * num;
        return numValue;
      }

      // CHANGE building colors
      let setTintNum = true;
      function setTintColor() {
        if (setTintNum) {
          setTintNum = false;
          return 0x000000;
        } else {
          setTintNum = true;
          return 0x000000;
        }
      }

      // CREATE City
      function init() {
        const segments = 2;
        for (let i = 1; i < 100; i++) {
          const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
          const material = new THREE.MeshStandardMaterial({
            color: setTintColor(),
            wireframe: false,
          });
          const wmaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            wireframe: true,
            transparent: true,
            opacity: 0.03,
            side: THREE.DoubleSide
          });

          const cube = new THREE.Mesh(geometry, material);
          const floor = new THREE.Mesh(geometry, material);
          const wfloor = new THREE.Mesh(geometry, wmaterial);

          cube.add(wfloor);
          cube.castShadow = true;
          cube.receiveShadow = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (cube as any).rotationValue = 0.1 + Math.abs(mathRandom(5));

          floor.scale.y = 0.05;
          cube.scale.y = 0.1 + Math.abs(mathRandom(5));

          const cubeWidth = 0.9;
          cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth);
          cube.position.x = Math.round(mathRandom());
          cube.position.z = Math.round(mathRandom());
          cube.position.y = cube.scale.y / 2; // Position buildings so they sit on the ground

          floor.position.set(cube.position.x, 0, cube.position.z);

          town.add(floor);
          town.add(cube);
        }

        // Particular
        const gmaterial = new THREE.MeshToonMaterial({ color: 0xFFFF00, side: THREE.DoubleSide });
        const gparticular = new THREE.CircleGeometry(0.01, 3);
        const aparticular = 5;

        for (let h = 1; h < 300; h++) {
          const particular = new THREE.Mesh(gparticular, gmaterial);
          particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
          particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
          smoke.add(particular);
        }

        const pmaterial = new THREE.MeshPhongMaterial({
          color: 0x000000,
          side: THREE.DoubleSide,
          roughness: 10,
          metalness: 0.6,
          opacity: 0.9,
          transparent: true
        });
        const pgeometry = new THREE.PlaneGeometry(60, 60);
        const pelement = new THREE.Mesh(pgeometry, pmaterial);
        pelement.rotation.x = -90 * Math.PI / 180;
        pelement.position.y = -0.001;
        pelement.receiveShadow = true;

        city.add(pelement);
      }

      // MOUSE function
      const mouse = new THREE.Vector2();

      function onMouseMove(event: MouseEvent) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      function onDocumentTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
          event.preventDefault();
          mouse.x = event.touches[0].pageX - window.innerWidth / 2;
          mouse.y = event.touches[0].pageY - window.innerHeight / 2;
        }
      }

      function onDocumentTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
          event.preventDefault();
          mouse.x = event.touches[0].pageX - window.innerWidth / 2;
          mouse.y = event.touches[0].pageY - window.innerHeight / 2;
        }
      }

      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('touchstart', onDocumentTouchStart, false);
      window.addEventListener('touchmove', onDocumentTouchMove, false);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 4);
      const lightFront = new THREE.SpotLight(0xFFFFFF, 20, 10);
      const lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

      lightFront.rotation.x = 45 * Math.PI / 180;
      lightFront.rotation.z = -45 * Math.PI / 180;
      lightFront.position.set(5, 5, 5);
      lightFront.castShadow = true;
      lightFront.shadow.mapSize.width = 6000;
      lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
      lightFront.penumbra = 0.1;
      lightBack.position.set(0, 6, 0);

      smoke.position.y = 2;

      scene.add(ambientLight);
      city.add(lightFront);
      scene.add(lightBack);
      scene.add(city);
      city.add(smoke);
      city.add(town);

      // GRID Helper
      const gridHelper = new THREE.GridHelper(60, 120, 0xFF0000, 0x000000);
      city.add(gridHelper);

      // LINES world
      const createCars = (cScale = 2, cPos = 20, cColor = 0xFFFF00) => {
        const cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
        const cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
        const cElem = new THREE.Mesh(cGeo, cMat);
        const cAmp = 3;

        if (createCarPos) {
          createCarPos = false;
          cElem.position.x = -cPos;
          cElem.position.z = mathRandom(cAmp);
        } else {
          createCarPos = true;
          cElem.position.x = mathRandom(cAmp);
          cElem.position.z = -cPos;
          cElem.rotation.y = 90 * Math.PI / 180;
        }

        cElem.receiveShadow = true;
        cElem.castShadow = true;
        cElem.position.y = Math.abs(mathRandom(5));
        city.add(cElem);
      };

      const generateLines = () => {
        for (let i = 0; i < 60; i++) {
          createCars(0.1, 20);
        }
      };

      // ANIMATE
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        city.rotation.y -= ((mouse.x * 8) - camera.rotation.y) * uSpeed;
        city.rotation.x -= (-(mouse.y * 8) - camera.rotation.x) * uSpeed;
        if (city.rotation.x < -0.05) city.rotation.x = -0.05;
        else if (city.rotation.x > 1) city.rotation.x = 1;

        smoke.rotation.y += 0.01;
        smoke.rotation.x += 0.01;

        camera.lookAt(city.position);
        renderer.render(scene, camera);
      };

      // START functions
      generateLines();
      init();
      animate();

      // Cleanup
      const cleanup = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchstart', onDocumentTouchStart);
        window.removeEventListener('touchmove', onDocumentTouchMove);
        if (mountRef.current && renderer.domElement) {
          try {
            mountRef.current.removeChild(renderer.domElement);
          } catch {
            // Element might already be removed
            console.log('Canvas already removed');
          }
        }
        renderer.dispose();
        sceneInitialized.current = false;
      };
      
      cleanupFn.current = cleanup;
      return cleanup;
    };

    // Try to initialize immediately if THREE is already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).THREE) {
      const cleanup = initThreeJS();
      return cleanup;
    }

    // Otherwise wait for the script to load
    const checkThree = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).THREE) {
        clearInterval(checkThree);
        const cleanup = initThreeJS();
        if (cleanup) {
          cleanupFn.current = cleanup;
        }
      }
    }, 100);

    return () => {
      clearInterval(checkThree);
      if (cleanupFn.current) {
        cleanupFn.current();
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Three.js loaded');
        }}
      />
      <div
        ref={mountRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ cursor: 'crosshair' }}
      />
    </>
  );
}
