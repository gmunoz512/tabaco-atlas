import { ContactShadows, OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas, useThree, type GLProps, type RootState } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useAtlas } from "@/state/atlas-store";
import { Monument } from "@/components/monument/Monument";
import { Surroundings } from "@/components/monument/Surroundings";

const GL_ATTRS = {
  antialias: true,
  alpha: false,
  depth: true,
  stencil: false,
  powerPreference: "high-performance" as const,
  preserveDrawingBuffer: false,
  premultipliedAlpha: true,
  failIfMajorPerformanceCaveat: false,
};

const createWebGLRenderer: GLProps = (defaultProps) => {
  const canvas = defaultProps.canvas as HTMLCanvasElement;
  const context =
    (canvas.getContext?.("webgl2", GL_ATTRS) as WebGL2RenderingContext | null) ??
    (canvas.getContext?.("webgl", GL_ATTRS) as WebGLRenderingContext | null) ??
    undefined;

  const renderer = new THREE.WebGLRenderer({
    ...defaultProps,
    ...GL_ATTRS,
    canvas,
    ...(context ? { context } : {}),
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  return renderer;
};

function assertWebGLRenderer(state: RootState) {
  if (!(state.gl instanceof THREE.WebGLRenderer)) {
    throw new Error("Monumento's Anatomy requires THREE.WebGLRenderer (WebGL), not CSS3D/SVG/Canvas2D.");
  }
  const canvas = state.gl.domElement;
  canvas.dataset.renderer = "WebGLRenderer";
  canvas.dataset.webgl = state.gl.capabilities.isWebGL2 ? "WebGL2" : "WebGL";
}

function WebGLReporter() {
  const { gl } = useThree();
  const setWebglStatus = useAtlas().setWebglStatus;

  useEffect(() => {
    if (!(gl instanceof THREE.WebGLRenderer)) return;
    const version = gl.capabilities.isWebGL2 ? "WebGL2" : "WebGL";
    gl.domElement.dataset.renderer = "WebGLRenderer";
    gl.domElement.dataset.webgl = version;
    setWebglStatus(`WebGLRenderer · ${version}`);
  }, [gl, setWebglStatus]);

  return null;
}

const CAMERA_POS: [number, number, number] = [0.18, 2.18, 16.7];
const CAMERA_POS_NARROW: [number, number, number] = [0.22, 2.55, 19.4];
const TARGET: [number, number, number] = [0, 8.05, 2.35];
const EXPLODE_CAM: [number, number, number] = [1.6, 15, 44];
const EXPLODE_CAM_NARROW: [number, number, number] = [1.4, 18, 58];
const EXPLODE_TARGET: [number, number, number] = [1.4, 5.2, 3.4];

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.88;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      envScene.dispose();
    };
  }, [gl, scene]);
  return null;
}

function assembledPos(narrow: boolean): [number, number, number] {
  return narrow ? CAMERA_POS_NARROW : CAMERA_POS;
}

function explodedPos(narrow: boolean): [number, number, number] {
  return narrow ? EXPLODE_CAM_NARROW : EXPLODE_CAM;
}

function applyFrame(
  camera: THREE.Camera,
  controls: OrbitControlsImpl | null,
  narrow: boolean,
  exploded: boolean,
) {
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = exploded ? (narrow ? 66 : 42) : narrow ? 48 : 38;
  cam.updateProjectionMatrix();
  const pos = exploded ? explodedPos(narrow) : assembledPos(narrow);
  const target = exploded ? EXPLODE_TARGET : TARGET;
  camera.position.set(...pos);
  controls?.target.set(...target);
  controls?.update();
}

function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { resetViewToken, explode } = useAtlas();
  const { camera, size } = useThree();
  const narrow = size.width / Math.max(size.height, 1) < 0.92;
  const framed = useRef<"assembled" | "exploded">("assembled");

  useEffect(() => {
    applyFrame(camera, controls.current, narrow, framed.current === "exploded");
  }, [camera, resetViewToken, narrow]);

  useEffect(() => {
    const node = controls.current;
    if (!node) return;
    const exploded = explode > 0.28;
    node.minDistance = exploded ? 18 : 8;
    node.maxDistance = exploded ? 130 : 52;
  }, [explode]);

  useEffect(() => {
    const next = explode > 0.38 ? "exploded" : explode < 0.14 ? "assembled" : framed.current;
    if (next === framed.current) return;
    framed.current = next;
    applyFrame(camera, controls.current, narrow, next === "exploded");
  }, [explode, camera, narrow]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.065}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI * 0.72}
      minDistance={8}
      maxDistance={52}
      target={TARGET}
    />
  );
}

function PostFx() {
  const { gl } = useThree();
  const samples = gl.capabilities.isWebGL2 ? 4 : 0;
  return (
    <EffectComposer multisampling={samples} enableNormalPass>
      <N8AO aoRadius={0.7} intensity={0.55} quality="medium" halfRes color="#6a737c" distanceFalloff={1.3} />
      <Bloom luminanceThreshold={0.92} intensity={0.08} mipmapBlur />
      <Vignette offset={0.38} darkness={0.12} />
      <SMAA />
    </EffectComposer>
  );
}

function SceneContents() {
  const { setSelectedId } = useAtlas();

  return (
    <>
      <color attach="background" args={["#6aa6dc"]} />
      <fog attach="fog" args={["#c8dced", 70, 150]} />
      <hemisphereLight args={["#f3e7c8", "#6d8a52", 0.78]} />
      <ambientLight intensity={0.4} color="#f7efe2" />
      <directionalLight
        position={[-20, 15, 9]}
        intensity={2.45}
        color="#ffe4b0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={36}
        shadow-camera-bottom={-18}
        shadow-bias={-0.00018}
        shadow-radius={2.2}
      />
      <directionalLight position={[12, 8, 16]} intensity={0.42} color="#a8c8e8" />
      <directionalLight position={[0, 6, 22]} intensity={0.28} color="#fff8ea" />
      <StudioEnvironment />
      <SoftShadows size={18} samples={10} focus={0.5} />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.22} scale={36} blur={2.6} far={16} />
      <CameraRig />
      <group
        onPointerMissed={() => {
          setSelectedId(null);
        }}
      >
        <Monument />
        <Surroundings />
      </group>
      <PostFx />
    </>
  );
}

export function MonumentScene() {
  return (
    <Canvas
      shadows
      legacy={false}
      linear={false}
      flat={false}
      camera={{ position: CAMERA_POS, fov: 38, near: 0.1, far: 280 }}
      dpr={[1, 2]}
      gl={createWebGLRenderer}
      onCreated={assertWebGLRenderer}
      className="absolute inset-0 z-0 h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <WebGLReporter />
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
