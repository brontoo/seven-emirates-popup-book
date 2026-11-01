import gsap from 'gsap';
export function foldPopups(timeline,rig,duration=.4) {
 rig.popups.forEach(p=>{timeline.to(p.scale,{y:.001,duration,ease:'power2.in'},0);timeline.to(p.rotation,{x:-.24,duration},0);timeline.set(p,{visible:false},duration);});
 return timeline;
}
export function unfoldPopups(timeline,rig,{at=0,reduced=false}={}) {
 rig.popups.forEach((p,i)=>{ const start=at+(reduced?0:i*.38);timeline.set(p,{visible:true},start);timeline.fromTo(p.scale,{y:.001},{y:1,duration:reduced?.01:1.15,ease:'power3.out'},start);timeline.fromTo(p.rotation,{x:-.24},{x:0,duration:reduced?.01:1.25,ease:'power2.out'},start); });
 return timeline;
}
export function openBook(rig,{reduced,onStage,onComplete}) {
 const tl=gsap.timeline({onComplete});
 tl.call(()=>onStage('Opening the book'));
 tl.set(rig.left.rotation,{z:-Math.PI},0);
 rig.popups.forEach(p=>{tl.set(p.scale,{y:.001},0);tl.set(p,{visible:false},0);});
 tl.to(rig.left.rotation,{z:0,duration:reduced?.01:1.9,ease:'power2.inOut'},0);
 tl.to(rig.root.rotation,{y:.025,duration:reduced?.01:2.4,ease:'sine.inOut'},0);
 tl.to(rig.left.rotation,{z:-.025,duration:reduced?0:.2},reduced?.01:1.9).to(rig.left.rotation,{z:0,duration:reduced?.01:.45,ease:'sine.out'});
 tl.call(()=>onStage('Unfolding the chapter'),[],reduced?.02:2.15);
 unfoldPopups(tl,rig,{at:reduced?.03:2.2,reduced});
 return tl;
}
export function closeBook(rig,{reduced,onComplete}) {
 const tl=gsap.timeline({onComplete});foldPopups(tl,rig,reduced?.01:.5);
 tl.to(rig.left.rotation,{z:-Math.PI,duration:reduced?.01:1.7,ease:'power2.inOut'},reduced?.02:.55);return tl;
}
export function turnPage(rig,{reduced,onSwap,onComplete}) {
 const tl=gsap.timeline({onComplete});const speed=reduced?.01:.95;
 foldPopups(tl,rig,reduced?.01:.45);
 tl.set(rig.turn,{visible:true},reduced?.01:.45).set(rig.turn.rotation,{z:0});
 tl.to(rig.turn.rotation,{z:Math.PI/2,duration:speed,ease:'power2.in'},reduced?.02:.48);
 tl.call(onSwap);
 tl.to(rig.turn.rotation,{z:Math.PI,duration:speed,ease:'power2.out'});
 tl.set(rig.turn,{visible:false});
 unfoldPopups(tl,rig,{at:reduced?.05:2.4,reduced});return tl;
}
