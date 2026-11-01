import { useMemo } from 'react';
import * as THREE from 'three';
import { Block, Paper, Fold, Selectable } from './Paper';
function FoldedTower({height=2.5,width=.42,position=[0,0,0],color='#8b9c9c',lean=.18}) {
 const geo=useMemo(()=>{const w=width/2,d=width*.62;const vertices=new Float32Array([-w,0,-d,w,0,-d,w,0,d,-w,0,d,-w+lean,height,-d*.55,w+lean,height,-d*.55,w+lean,height-.18,d*.55,-w+lean,height-.18,d*.55]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(vertices,3));g.setIndex([0,2,1,0,3,2,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7,4,5,6,4,6,7]);g.computeVertexNormals();return g;},[height,width,lean]);
 return <group position={position}><mesh geometry={geo} castShadow receiveShadow><Paper color={color} flatShading/></mesh>
  <Block position={[lean/2,height*.48,width*.63]} size={[.014,height*.93,.018]} rotation={[0,0,-Math.atan(lean/height)]} color="#cbd0c3"/>
  {[.18,.36,.54,.72,.87].map(t=><Block key={t} position={[lean*t,height*t,width*.62*(1-t*.45)+.006]} size={[width,.012,.016]} color="#b2bdb6"/>)}
  <Fold z={-.23} width={width*.9} height={height*.33} color="#c4c5b5"/>
 </group>;
}
export default function Towers(props) {return <Selectable id="towers" {...props}>
 <Block position={[.08,.025,0]} size={[2.05,.05,1.6]} color="#d8d2be" edges/>
 <Block position={[.1,.08,.1]} size={[1.8,.08,1.1]} color="#e8dfc8" edges/>
 <FoldedTower position={[-.59,.12,-.33]} height={2.22} width={.35} color="#9ba9a6" lean={.15}/>
 <FoldedTower position={[-.04,.12,-.44]} height={2.83} width={.42} color="#829b9d" lean={.21}/>
 <FoldedTower position={[.51,.12,-.26]} height={2.54} width={.39} color="#a6b1aa" lean={.16}/>
 <FoldedTower position={[-.42,.12,.39]} height={1.75} width={.34} color="#b0b9ad" lean={.1}/>
 <FoldedTower position={[.28,.12,.41]} height={2.05} width={.36} color="#8eaaa8" lean={.19}/>
 </Selectable>;}
export function DubaiStudy(props) {return <Selectable id="burj" {...props}>
 <Block size={[2.9,.06,1.4]} position={[0,.03,0]} color="#d9d0b8" edges/>
 {[0,1,2,3,4,5,6].map(i=><Block key={i} position={[0,.12+i*.36,0]} size={[.65-i*.075,.39,.55-i*.064]} color={i%2?'#c0c4b8':'#a3b1ac'} edges/>)}
 <mesh position={[0,2.97,0]} castShadow><coneGeometry args={[.055,.8,4]}/><Paper color="#d2ceba"/></mesh>
 {[-1,1].map(x=><FoldedTower key={x} position={[x*.94,.06,0]} height={1.15+(x+1)*.16} width={.38} lean={x*.07} color="#aeb8af"/>)}
 </Selectable>;}
