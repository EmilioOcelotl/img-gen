import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js';

let renderer, scene, camera, composer; 

let cube, ring;

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false
})

shape(4,0.7).mult(osc(5,-0.001,9).modulate(noise(3,1)).rotate(10), 1).modulateScale(osc(4,-0.03,0).kaleid(50).scale(0.6),15,0.1).out()

const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none'; 

let vit = new THREE.CanvasTexture(elCanvas);

let light1, light2, light3, light4; 

init();

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement ); 
    
    // scene.background = vit; 

    light1 = new THREE.PointLight( 0xffffff, 1 );
    light1.position.set( 0, 0, 5 );
    scene.add( light1 );
    
    light2 = new THREE.PointLight( 0xffffff, 1 );
    light2.position.set( 0, 0, 5 );
    scene.add( light2 );

    // const geometry = new THREE.BoxGeometry();
    const geometry = new THREE.SphereGeometry( 3, 64, 64 );
    // Buffergeometry 
    console.log(geometry.attributes.position); 
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:vit, metalness: 0.4, roughness: 0.9 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const geometryP = new THREE.PlaneGeometry( 16, 9 );
    const materialP = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide, map:vit } );
    const plane = new THREE.Mesh( geometryP, material );
    scene.add( plane );

    const geometryR = new THREE.RingGeometry( 5.9, 6, 64, 8, 0, Math.PI );
    const materialR = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.DoubleSide } );
    ring = new THREE.Mesh( geometryR, materialR );
    scene.add( ring );
    
    camera.position.z = 10;
    const renderScene = new RenderPass( scene, camera );
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.2;
    bloomPass.radius = 0.4;
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    
}
function animate() {

    var time2 = Date.now() * 0.0005;

    light1.position.x = Math.sin( time2 * 0.3/2 ) * 24;
    light1.position.y = Math.cos( time2 * 0.7/2 ) * 10;
    // light1.position.z = Math.cos( time2 * 0.3/2 ) * 24 ;

    light2.position.x = Math.cos( time2 * 0.7/2 ) * -24;
    light2.position.y = Math.sin( time2* 0.3/2 ) * -10;
    //light2.position.z = Math.cos( time2 * 0.3/2 ) * ;

    vit.needsUpdate = true; 
    requestAnimationFrame( animate );

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.002;

    ring.rotation.z -= 0.01; 

    //renderer.render( scene, camera );
    composer.render();

};

animate();
