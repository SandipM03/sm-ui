import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Add type declaration for intrinsic elements to fix TS errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
    }
  }
}

// Types
type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// Custom shader material
const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        
        // Curve based on scroll force
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        // Gentle ripple
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        
        // Flag wave on hover
        float flagWave = 0.0;
        if (isHovered > 0.5) {
           float wavePhase = pos.x * 3.0 + time * 8.0;
           float waveAmplitude = sin(wavePhase) * 0.1;
           float dampening = smoothstep(-0.5, 0.5, pos.x);
           flagWave = waveAmplitude * dampening;
           float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
           flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vec4 color = texture2D(map, vUv);
        
        // Blur
        if (blurAmount > 0.0) {
           vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
           vec4 blurred = vec4(0.0);
           float total = 0.0;
           // Reduced kernel for performance
           for (float x = -1.0; x <= 1.0; x += 1.0) {
             for (float y = -1.0; y <= 1.0; y += 1.0) {
               vec2 offset = vec2(x, y) * texelSize * blurAmount;
               float weight = 1.0 / (1.0 + length(vec2(x, y)));
               blurred += texture2D(map, vUv + offset) * weight;
               total += weight;
             }
           }
           color = blurred / total;
        }
        
        // Curve lighting highlight
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function ImagePlane({
  texture,
  position,
  scale,
  material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useEffect(() => {
    if (material && material.uniforms) {
      material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    }
  }, [material, isHovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  fadeSettings,
  blurSettings,
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  
  // NOTE: autoPlay removed as requested
  
  const normalizedImages = useMemo(() => 
    images.map((img) => typeof img === 'string' ? { src: img, alt: '' } : img),
    [images]
  );

  const textures = useTexture(normalizedImages.map((img) => img.src));

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;
      
      const x = (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET) / 3;
      const y = (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4;
      positions.push({ x, y });
    }
    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;
  
  const planesData = useRef<PlaneData[]>([]);

  // Initialize if empty
  if (planesData.current.length === 0) {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      // Increase sensitivity slightly
      setScrollVelocity((prev) => prev + event.deltaY * 0.02 * speed);
    },
    [speed]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        setScrollVelocity((prev) => prev - 2 * speed);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        setScrollVelocity((prev) => prev + 2 * speed);
      }
    },
    [speed]
  );

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleWheel, handleKeyDown]);

  useFrame((state, delta) => {
    // Damping / Friction
    setScrollVelocity((prev) => prev * 0.95);

    const time = state.clock.getElapsedTime();
    
    // Update uniforms
    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    // Update positions
    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;
    const halfRange = totalRange / 2;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }
      if (wrapsBackward > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      
      // Calculate opacity and blur
      const normalizedPosition = plane.z / totalRange;
      let opacity = 1;
      let blur = 0;
      
      // Fade Logic
      const fs = fadeSettings || { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } };
      if (normalizedPosition >= fs.fadeIn.start && normalizedPosition <= fs.fadeIn.end) {
        opacity = (normalizedPosition - fs.fadeIn.start) / (fs.fadeIn.end - fs.fadeIn.start);
      } else if (normalizedPosition < fs.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPosition >= fs.fadeOut.start && normalizedPosition <= fs.fadeOut.end) {
        opacity = 1 - (normalizedPosition - fs.fadeOut.start) / (fs.fadeOut.end - fs.fadeOut.start);
      } else if (normalizedPosition > fs.fadeOut.end) {
        opacity = 0;
      }

      // Blur Logic
      const bs = blurSettings || { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 };
      if (normalizedPosition >= bs.blurIn.start && normalizedPosition <= bs.blurIn.end) {
         const p = (normalizedPosition - bs.blurIn.start) / (bs.blurIn.end - bs.blurIn.start);
         blur = bs.maxBlur * (1 - p);
      } else if (normalizedPosition < bs.blurIn.start) {
         blur = bs.maxBlur;
      } else if (normalizedPosition >= bs.blurOut.start && normalizedPosition <= bs.blurOut.end) {
         const p = (normalizedPosition - bs.blurOut.start) / (bs.blurOut.end - bs.blurOut.start);
         blur = bs.maxBlur * p;
      } else if (normalizedPosition > bs.blurOut.end) {
         blur = bs.maxBlur;
      }

      // Update material
      const mat = materials[i];
      if (mat && mat.uniforms) {
        mat.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));
        mat.uniforms.blurAmount.value = Math.max(0, Math.min(bs.maxBlur, blur));
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];
        if (!texture || !material) return null;
        
        const worldZ = plane.z - depthRange / 2;
        const aspect = texture.image ? texture.image.width / texture.image.height : 1;
        const scale: [number, number, number] = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];
        
        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]}
            scale={scale}
            material={material}
          />
        );
      })}
    </>
  );
}

function FallbackGallery({ images }: { images: ImageItem[] }) {
   return (
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
       {images.map((img, i) => (
         <img 
            key={i} 
            src={typeof img === 'string' ? img : img.src} 
            className="w-full h-auto rounded opacity-50 hover:opacity-100 transition-opacity"
          />
       ))}
     </div>
   );
}

export default function InfiniteGallery({
  images,
  className = 'h-screen w-full',
  style,
  fadeSettings,
  blurSettings,
}: InfiniteGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GalleryScene
          images={images}
          speed={1.5}
          visibleCount={12}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
        />
      </Canvas>
    </div>
  );
}