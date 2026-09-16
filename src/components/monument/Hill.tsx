export function Hill() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <circleGeometry args={[22, 56]} />
        <meshStandardMaterial color="#5f7a48" roughness={1} />
      </mesh>
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[7.4, 11.5, 1.35, 40]} />
        <meshStandardMaterial color="#4e6840" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <ringGeometry args={[5.4, 7.6, 48]} />
        <meshStandardMaterial color="#6a7f52" roughness={1} />
      </mesh>
    </group>
  );
}
