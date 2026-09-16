import * as THREE from "three";

export function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <ringGeometry args={[0.62, 5.2, 56]} />
        <meshStandardMaterial color="#2a2318" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <ringGeometry args={[0.62, 1.35, 40]} />
        <meshStandardMaterial color="#3b2d20" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.66, 28]} />
        <meshStandardMaterial color="#4a3828" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {[
        [0.95, 0.03, 0.5, 0.08],
        [-0.72, 0.025, 0.78, 0.06],
        [0.42, 0.02, -0.88, 0.05],
        [-1.05, 0.02, -0.32, 0.045],
      ].map(([x, y, z, r], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color="#4a3a2c" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
