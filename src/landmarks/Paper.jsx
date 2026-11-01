import { Edges } from '@react-three/drei';
import * as THREE from 'three';
export function Paper({ color = '#f1ead9', ...props }) { return <meshStandardMaterial color={color} roughness={1} metalness={0} {...props} />; }
export function Block({ position, size, color, rotation, edges=false, ...props }) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow {...props}><boxGeometry args={size}/><Paper color={color}/>{edges && <Edges color="#786e58" opacity={.18} transparent threshold={25}/>}</mesh>;
}
export function Fold({ x=0, z=0, width=.7, height=.6, color='#ded5be' }) {
  const shape = new THREE.Shape(); shape.moveTo(-width/2,0); shape.lineTo(width/2,0); shape.lineTo(0,height); shape.closePath();
  return <mesh position={[x,0,z]} castShadow><extrudeGeometry args={[shape,{depth:.025,bevelEnabled:false}]}/><Paper color={color} side={THREE.DoubleSide}/><Edges color="#b0a38a"/></mesh>;
}
export function Selectable({ id, selected, onSelect, children, ...props }) {
  return <group {...props} onClick={e=>{e.stopPropagation();onSelect(id);}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='auto';}}>
    {children}
    {selected === id && <mesh rotation={[-Math.PI/2,0,0]} position={[0,.027,0]}><ringGeometry args={[.75,.775,64]}/><meshBasicMaterial color="#b29151" transparent opacity={.8}/></mesh>}
  </group>;
}
