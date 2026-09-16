export function Hill() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]} receiveShadow>
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#5c7848" roughness={1} />
      </mesh>
      <mesh position={[0, -0.78, 0]} receiveShadow>
        <cylinderGeometry args={[7.1, 12.2, 1.45, 48]} />
        <meshStandardMaterial color="#4a663c" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
        <ringGeometry args={[5.2, 7.8, 56]} />
        <meshStandardMaterial color="#667e50" roughness={1} />
      </mesh>
    </group>
  );
}
