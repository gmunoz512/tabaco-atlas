export function Hill() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#1a2430" roughness={1} />
      </mesh>
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[6.8, 9.5, 1.1, 32]} />
        <meshStandardMaterial color="#243040" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <ringGeometry args={[4.7, 6.6, 40]} />
        <meshStandardMaterial color="#2c3948" roughness={1} />
      </mesh>
    </group>
  );
}
