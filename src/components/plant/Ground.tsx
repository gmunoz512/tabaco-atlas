export function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[4.8, 48]} />
        <meshStandardMaterial color="#2a2318" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[1.15, 36]} />
        <meshStandardMaterial color="#3b2d20" roughness={1} />
      </mesh>
      {[
        [0.7, 0.03, 0.4, 0.08],
        [-0.55, 0.025, 0.62, 0.06],
        [0.3, 0.02, -0.7, 0.05],
        [-0.8, 0.02, -0.25, 0.045],
      ].map(([x, y, z, r], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color="#4a3a2c" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
