import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { chapters } from '../data/chapters';
import { Block, Paper, Selectable } from '../landmarks/Paper';
import { paperTexture, coverTexture } from './materials';
import Mosque from '../landmarks/Mosque';
import Towers, { DubaiStudy } from '../landmarks/Towers';
import Mangroves from '../landmarks/Mangroves';
function Page({side,label}) {const x=side*2.18;return <>
 <mesh position={[x,-.17,0]} receiveShadow castShadow><boxGeometry args={[4.5,.115,5.77]}/>{Array.from({length:6},(_,i)=><meshStandardMaterial key={i} attach={`material-${i}`} color={i===3?'#ffffff':'#4a594d'} map={i===3?coverTexture():null} roughness={1}/>)}</mesh>
 {Array.from({length:9},(_,i)=><Block key={i} position={[x,-.1+i*.018,0]} size={[4.35-i*.006,.016,5.56-i*.003]} color={i%2?'#d2c8af':'#e1d7bf'}/>)}
 <mesh position={[x,.073,0]} receiveShadow castShadow><boxGeometry args={[4.29,.025,5.5]}/>{Array.from({length:6},(_,i)=><meshStandardMaterial key={i} attach={`material-${i}`} color={i===2?'#ffffff':'#dfd4bb'} map={i===2?paperTexture(label):null} roughness={1}/>)}</mesh>
 <Block position={[side*.055,.08,0]} size={[.028,.012,5.5]} color="#c1b59c"/>
 </>;}
const models={mosque:Mosque,towers:Towers,mangroves:Mangroves,burj:DubaiStudy};
// Assets share the same base pivot and animation wrapper as procedural models.
function Asset({entry,selected,onSelect}) {
 const {scene}=useGLTF(entry.asset);
 const model=useMemo(()=>{const copy=scene.clone(true);copy.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});return copy;},[scene]);
 return <Selectable id={entry.model} selected={selected} onSelect={onSelect}><primitive object={model} scale={entry.assetScale||1} position={entry.assetOffset||[0,0,0]}/></Selectable>;
}
const Book=forwardRef(function Book({chapter,selected,onSelect},ref){
 const root=useRef(),left=useRef(),popupRefs=useRef([]),turn=useRef();
 const slots=Math.max(...chapters.map(c=>c.scene?.length||0));
 const layout=chapters[chapter];
 useImperativeHandle(ref,()=>({root:root.current,left:left.current,popups:popupRefs.current,turn:turn.current}),[]);
 return <group ref={root} position={[0,.05,0]}>
  <Block position={[0,-.19,0]} size={[.24,.2,5.78]} color="#36483e"/>
  <mesh position={[0,-.15,0]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.14,.14,5.74,16,1,false,0,Math.PI]}/><Paper color="#425345"/></mesh>
  <group ref={left} rotation={[0,0,-Math.PI]}><Page side={-1} label={layout.study?'THE SEVEN EMIRATES  /  A PAPER STUDY':'THE SEVEN EMIRATES  /  A STORY IN PAPER'}/></group>
  <group><Page side={1} label={`${layout.index}     —     ${layout.title.toUpperCase()}`}/></group>
  {Array.from({length:slots},(_,i)=>{const entry=layout.scene?.[i];const Model=entry&&models[entry.model];return <group key={i} position={entry?.position||[0,.1,0]} ref={node=>{popupRefs.current[i]=node;}} visible={false} scale={[1,.001,1]}>
    {entry&&(entry.asset?<Asset entry={entry} selected={selected} onSelect={onSelect}/>:Model?<Model selected={selected} onSelect={onSelect}/>:null)}
  </group>;})}
  <group ref={turn} visible={false} position={[0,.115,0]}><mesh position={[2.16,0,0]} castShadow receiveShadow><boxGeometry args={[4.3,.022,5.5]}/><meshStandardMaterial map={paperTexture('THE SEVEN EMIRATES')} roughness={1} side={THREE.DoubleSide}/></mesh><Block position={[.12,.025,0]} size={[.025,.02,5.48]} color="#c7baa1"/></group>
  <mesh position={[.1,-.075,2.9]} rotation={[-Math.PI/2,0,.08]}><planeGeometry args={[.12,.52]}/><Paper color="#a99367" side={THREE.DoubleSide}/></mesh>
 </group>;
});
export default Book;
