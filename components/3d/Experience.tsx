"use client";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { Suspense } from "react";

export default function Experience({ stars = 5000, sparkles = 100 }: { stars?: number; sparkles?: number }) {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
            <Stars radius={50} depth={50} count={stars} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={sparkles} scale={5} size={1} speed={0.4} opacity={0.5} color="#8B5CF6" />
        </Suspense>
      </Canvas>
    </div>
  );
}
