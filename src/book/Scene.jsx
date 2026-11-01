import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { OrbitControls, SoftShadows } from '@react-three/drei';
import Book from './Book';
import { openBook, closeBook, turnPage } from '../animation/bookTimeline';
function CameraRig({reduced}) {
 const { camera, size, invalidate }=useThree();
 useEffect(()=>{camera.fov=size.width<650?40:size.width<1100?32:27;camera.updateProjectionMatrix();
 const t=gsap.fromTo(camera.position,{x:10.1,y:9.5,z:13.5},{x:9.4,y:9.1,z:12.7,duration:reduced?0:4.5,ease:'sine.inOut',onUpdate:invalidate});return ()=>t.kill();},[camera,size,reduced,invalidate]);
 return <OrbitControls makeDefault target={[0,0,0]} enablePan={false} minDistance={11} maxDistance={23} minPolarAngle={.4} maxPolarAngle={Math.PI*.43} minAzimuthAngle={-.85} maxAzimuthAngle={.95} enableDamping dampingFactor={.065} rotateSpeed={.55} autoRotate={false}/>;
}
function World({command,chapter,selected,onSelect,onStatus,onReady,reduced,lowPower}) {
 const invalidate=useThree(s=>s.invalidate);
 const rig=useRef(); const timeline=useRef(); const current=useRef(0);const [shownChapter,setShownChapter]=useState(0);
 useEffect(()=>{ if(!rig.current)return;timeline.current?.kill();
 const finish=()=>{onStatus(command.type==='close'?'Closed':'Ready');onReady(command.type!=='close');};
 if(command.type==='turn') {onStatus('Turning the page');timeline.current=turnPage(rig.current,{reduced,onSwap:()=>{current.current=chapter;setShownChapter(chapter);},onComplete:finish});}
 else if(command.type==='close'){onStatus('Closing the book');timeline.current=closeBook(rig.current,{reduced,onComplete:finish});}
 else {if(current.current!==chapter){current.current=chapter;setShownChapter(chapter);} timeline.current=openBook(rig.current,{reduced,onStage:onStatus,onComplete:finish});}
 timeline.current.eventCallback('onUpdate',invalidate);invalidate();
 return ()=>timeline.current?.kill();
 },[command,chapter,reduced,onStatus,onReady,invalidate]);
 return <>
  <color attach="background" args={['#242c27']}/><fog attach="fog" args={['#242c27',30,65]}/>
  {!lowPower&&<SoftShadows size={18} samples={8} focus={.5}/>}
  <ambientLight intensity={.85} color="#e6e3d2"/>
  <hemisphereLight intensity={1.1} args={['#fff5df','#687264']}/>
  <directionalLight position={[-4,10,4]} intensity={3.1} color="#fff2d8" castShadow shadow-mapSize-width={lowPower?1024:2048} shadow-mapSize-height={lowPower?1024:2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.035} shadow-bias={-.00015} shadow-radius={4}/>
  <directionalLight position={[6,5,-6]} intensity={1.35} color="#d5e3df"/>
  <Book ref={rig} chapter={shownChapter} selected={selected} onSelect={onSelect}/>
  <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-.31,0]}><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={.3}/></mesh>
  <CameraRig reduced={reduced}/>
 </>;
}
export default function Scene(props) {return <Canvas frameloop="demand" shadows dpr={props.lowPower?1:[1,1.65]} camera={{position:[9.4,9.1,12.7],fov:34,near:.1,far:100}} gl={{antialias:!props.lowPower,powerPreference:props.lowPower?'low-power':'high-performance'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',props.onContextLost,{once:true});}}><Suspense fallback={null}><World {...props}/></Suspense></Canvas>;}
