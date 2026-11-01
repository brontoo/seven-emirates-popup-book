import { useMemo } from 'react';
import * as THREE from 'three';
import { Block, Paper, Selectable } from './Paper';
function Water({level,color}) {const shape=useMemo(()=>{const s=new THREE.Shape();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;const r=1+Math.sin(a*5)*.06+Math.cos(a*3)*.09;const x=Math.cos(a)*r*(1.3-level*.08),y=Math.sin(a)*r*(.72-level*.06);i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();return s;},[level]);return <mesh rotation={[-Math.PI/2,0,0]} position={[0,.035+level*.035,0]} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:.024,bevelEnabled:false}]}/><Paper color={color}/></mesh>;}
function Tree({position,scale=1}) {
 const shape=useMemo(()=>{const s=new THREE.Shape();for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;const r=.29+Math.sin(a*7)*.035;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r*.85):s.moveTo(Math.cos(a)*r,Math.sin(a)*r*.85);}return s;},[]);
 return <group position={position} scale={scale}>
 <Block position={[0,.24,0]} size={[.035,.47,.035]} color="#8a8061"/>
 {[-1,1].map(x=><Block key={x} position={[x*.065,.26,0]} size={[.022,.21,.025]} rotation={[0,0,-x*.6]} color="#8a8061"/>)}
 {[0,1,2].map(i=><mesh key={i} position={[0,.49+i*.035,(i-1)*.07]} rotation={[0,(i-1)*.55,0]} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:.025,bevelEnabled:false}]}/><Paper color={['#8a9a72','#a9b08a','#6e896e'][i]}/></mesh>)}
 <Block position={[0,.15,0]} rotation={[0,0,.45]} size={[.018,.3,.02]} color="#9a8860"/>
 </group>;
}
export default function Mangroves(props) {return <Selectable id="mangroves" {...props}>
 {['#b8c8b7','#86aaa3','#6c9691','#a1bab0'].map((c,i)=><Water key={c} level={i} color={c}/>)}
 {[[-.85,.16,-.05,.9],[-.45,.16,-.3,1.15],[-.03,.16,-.34,1.35],[.4,.16,-.25,1.05],[.83,.16,-.03,.8],[-.25,.16,.19,.8],[.32,.16,.17,.9]].map(([x,y,z,s],i)=><Tree key={i} position={[x,y,z]} scale={s}/>)}
 </Selectable>;}
