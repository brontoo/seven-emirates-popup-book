import { useMemo } from 'react';
import * as THREE from 'three';
import { Block, Paper, Fold, Selectable } from './Paper';
function Dome({position=[0,0,0],scale=1}) {
  const points=useMemo(()=>[[0,0],[.46,0],[.48,.08],[.46,.2],[.4,.34],[.27,.49],[.12,.6],[.035,.7],[0,.73]].map(p=>new THREE.Vector2(...p)),[]);
  return <group position={position} scale={scale}><mesh castShadow receiveShadow><latheGeometry args={[points,24]}/><Paper color="#f9f3e5" flatShading/></mesh><mesh position={[0,.77,0]} castShadow><coneGeometry args={[.022,.14,5]}/><Paper color="#b69d68"/></mesh></group>;
}
function Minaret({position}) { return <group position={position}>
  <Block position={[0,.3,0]} size={[.17,.6,.17]} color="#e6decb" edges/>
  <mesh position={[0,.84,0]} castShadow><cylinderGeometry args={[.058,.09,.55,8]}/><Paper color="#f2ead7" flatShading/></mesh>
  {[.58,1.1,1.35].map((y,i)=><mesh key={y} position={[0,y,0]} castShadow><cylinderGeometry args={[.12-i*.025,.12-i*.025,.055,8]}/><Paper/></mesh>)}
  <mesh position={[0,1.25,0]} castShadow><cylinderGeometry args={[.038,.052,.3,8]}/><Paper/></mesh>
  <mesh position={[0,1.52,0]} castShadow><coneGeometry args={[.075,.3,8]}/><Paper color="#f7efdf"/></mesh>
  <mesh position={[0,1.72,0]}><coneGeometry args={[.012,.1,4]}/><Paper color="#b69d68"/></mesh>
  </group>; }
function Arcade({position, width=2.25, count=9}) {
  const shape=useMemo(()=>{ const s=new THREE.Shape();s.moveTo(-width/2,0);s.lineTo(width/2,0);s.lineTo(width/2,.45);s.lineTo(-width/2,.45);s.closePath();
    for(let i=0;i<count;i++){const x=-width/2+(i+.5)*width/count;const w=width/count*.34;const h=new THREE.Path();h.moveTo(x-w,0);h.lineTo(x-w,.21);h.quadraticCurveTo(x-w,.33,x,.37);h.quadraticCurveTo(x+w,.33,x+w,.21);h.lineTo(x+w,0);h.closePath();s.holes.push(h);}return s;},[width,count]);
  return <mesh position={position} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:.07,bevelEnabled:false}]}/><Paper color="#f0e8d4"/></mesh>;
}
export default function Mosque(props) {
  return <Selectable id="mosque" {...props}>
    <Block position={[0,.04,0]} size={[3.1,.08,2.24]} color="#dcd3ba" edges/>
    <Block position={[0,.09,0]} size={[2.96,.035,2.1]} color="#f1e8d1"/>
    <Block position={[0,.12,.25]} size={[1.83,.02,.76]} color="#ded9c8"/>
    {[-1,1].map(x=><Fold key={x} x={x*1.15} z={-.38} width={.4} height={.5}/>)}
    <Block position={[0,.44,-.44]} size={[1.05,.65,.77]} color="#f1e9d6" edges/>
    <Dome position={[0,.77,-.44]} scale={1.08}/>
    {[-1,1].map(x=><group key={x}><Block position={[x*.89,.31,-.44]} size={[.65,.4,.7]} color="#eae1ce"/><Dome position={[x*.89,.51,-.44]} scale={.56}/></group>)}
    <Arcade position={[0,.12,.86]} width={2.59}/>
    {[-1,1].map(x=><group key={x}><group position={[x*1.25,.12,.12]} rotation={[0,Math.PI/2,0]}><Arcade width={1.48} count={6}/></group>
    {[-.72,.85].map(z=><Minaret key={z} position={[x*1.35,.12,z]}/>)}
    {[-.45,-.08,.29,.66].map(z=><Dome key={z} position={[x*1.23,.57,z]} scale={.25}/>)}</group>)}
    {[-.96,-.64,-.32,0,.32,.64,.96].map(x=><Dome key={x} position={[x,.57,.86]} scale={.23}/>)}
    <Block position={[0,.3,-.015]} size={[.34,.36,.03]} color="#b7a988"/>
    <mesh position={[0,.46,.007]}><circleGeometry args={[.17,16,0,Math.PI]}/><Paper color="#b7a988"/></mesh>
  </Selectable>;
}
