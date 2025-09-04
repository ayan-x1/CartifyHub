'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useGLTF, PresentationControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Fullscreen } from 'lucide-react';
import * as THREE from 'three';

interface Product3DViewerProps {
  modelUrl: string;
}

function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  return (
    // @ts-ignore
    <primitive 
      object={scene} 
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

export function Product3DViewer({ modelUrl }: Product3DViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    // This will be handled by the OrbitControls reset
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const event = new Event('reset-view');
      canvas.dispatchEvent(event);
    }
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={resetView}
          className="bg-white/80 hover:bg-white/90"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-white/80 hover:bg-white/90"
        >
          <Fullscreen className="h-4 w-4" />
        </Button>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 3D Model...</p>
            </div>
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            {/* @ts-ignore */}
            <ambientLight intensity={0.6} />
            {/* @ts-ignore */}
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {/* @ts-ignore */}
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            <PresentationControls
              global
              rotation={[0, -Math.PI / 4, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 2]}
            >
              <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Model modelUrl={modelUrl} />
              </Float>
            </PresentationControls>
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
              autoRotate={false}
            />
            
            <Environment preset="studio" />
          </Canvas>
        </Suspense>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Use your mouse to rotate, scroll to zoom, and drag to pan the 3D model</p>
      </div>
    </div>
  );
}