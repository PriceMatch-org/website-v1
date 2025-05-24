'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'public/jsm/controls/OrbitControls';

const EarthTSLLookalike: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(3.5, 1.5, 2.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x555555, 8);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffbb88, 5);
    sun.position.set(-5, 1, 2);
    sun.castShadow = false;
    scene.add(sun);

    const textureLoader = new THREE.TextureLoader();
    const nightMap = textureLoader.load('/textures/planets/earth_night_4096.jpg');
    nightMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.anisotropy = 8;

    const dayMap = textureLoader.load('/textures/planets/earth_day_4096.jpg');
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 8;

const cloudMap = textureLoader.load('/textures/planets/earth_clouds_transparent_4096.png');
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.anisotropy = 8;

    const sphere = new THREE.SphereGeometry(1, 64, 64);

    // Earth Material (Day + Night Blend, Desaturated)
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        sunDirection: { value: sun.position.clone().normalize() }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vec3 normal = normalize(vNormal);
          float sunFactor = dot(normal, sunDirection);
          sunFactor = clamp(sunFactor * 5.0, 0.0, 1.0);

          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          vec3 finalColor = mix(nightColor, dayColor, sunFactor);
          finalColor = mix(finalColor, vec3(0.5), 0.2); // desaturate + darken
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const globe = new THREE.Mesh(sphere, globeMaterial);
    scene.add(globe);

    // Clouds
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const cloudMesh = new THREE.Mesh(sphere.clone(), cloudMaterial);
    cloudMesh.scale.set(1.015, 1.015, 1.015);
    // scene.add(cloudMesh);

    // Atmosphere
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
gl_FragColor = vec4(0.2, 0.4, 0.9, 0.3 * intensity);

        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(sphere, atmosphereMaterial);
    atmosphere.scale.set(1.12, 1.12, 1.12);
    scene.add(atmosphere);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      globe.rotation.y += delta * 0.025;
      cloudMesh.rotation.y += delta * 0.01; // slow cloud drift
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full fixed inset-0 z-0 bg-black" />;
};

export default EarthTSLLookalike;
