import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js';
// import * as OSC from 'osc-js'; 

document.body.style.cursor = 'none'; 

let renderer2, scene, camera, composer, controls; 

let cube, ring, ring2, ring3;


let texture;
let dpr = window.devicePixelRatio; 
let textureSize = 1024 * dpr;
const vector = new THREE.Vector2();

let materialC2;
let audioSphere; 
let cuboGrande, cuboGrandeCopy; 

let retroBool = true;
let gamepads; 

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false
})

// shape(4,0.7).mult(osc(5,-0.001,9).modulate(noise(3,1)).rotate(10), 1).modulateScale(osc(4,-0.03,0).kaleid(50).scale(0.6),15,0.1).out()

osc(20, 0.01, 0.01)
	.kaleid(7)
	.rotate(0, 0.1)
	.modulate(o0, () => mouse.x * 0.0003)
	.scale(1.01)
  	.out(o0)

const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none'; 

let vit = new THREE.CanvasTexture(elCanvas);

let light1, light2, light3, light4; 

let bamboo = []; 

init();

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    retro();

    // scene.background = new THREE.Color( 0x000000 ); 
    
    light1 = new THREE.PointLight( 0xffffff, 0.25 );
    light1.position.set( 0, 0, 5 );
    scene.add( light1 );
    
    light2 = new THREE.PointLight( 0xffffff, 0.25 );
    light2.position.set( 0, 0, 5 );
    scene.add( light2 );

    //const geometry = new THREE.BoxGeometry(3, 3, 3);
    const geometry = new THREE.SphereGeometry(1, 64, 64 );
    // Buffergeometry 
    // console.log(geometry.attributes.position); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:vit } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const geometryP = new THREE.PlaneGeometry( 16*2, 9*2 );
    const materialP = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: vit} );
    const plane = new THREE.Mesh( geometryP, materialP );
    // scene.add( plane );

    const geometryR = new THREE.RingGeometry( 5.8, 6, 64, 8, 0, Math.PI );
    const materialR = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:vit } );
    ring = new THREE.Mesh( geometryR, materialR );
    //scene.add( ring );

    const geometryR2 = new THREE.RingGeometry( 5, 5.2, 64, 8, 0, Math.PI );
    const materialR2 = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:vit } );
    ring2 = new THREE.Mesh( geometryR2, materialR2 );
    //scene.add( ring2 );

    const geometryR3 = new THREE.RingGeometry( 4.2, 4.4, 64, 8, 0, Math.PI );
    const materialR3 = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map:vit } );
    ring3 = new THREE.Mesh( geometryR3, materialR2 );
    // scene.add( ring3 );
   
    materialC2 = new THREE.MeshBasicMaterial( {
	map: texture,
	side: THREE.DoubleSide,
	// transparent: true,
	// color: diffuseColor,
	// reflectivity: beta,
	// envMap: alpha < 0.5 ? reflectionCube : null
    } );

    audioSphere = new THREE.BoxGeometry( 40, 40, 40, 16, 16, 16 )
    audioSphere.usage = THREE.DynamicDrawUsage;
	
    audioSphere.computeBoundingBox();	  
  
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeCopy = new THREE.Mesh(audioSphere.clone(), materialC2 );
   
    cuboGrande.geometry.usage = THREE.DynamicDrawUsage;
	    
   scene.add(cuboGrande);
   
    /*
    let pilaresMaterial = new THREE.MeshBasicMaterial( {
	color: 0x000000,
	// envMap: vit,
	refractionRatio: 0.75,
	roughness: 0.2,
	metalness: 0.8,
	// map: vit 
    } );
    
    const pilargeom = new THREE.BoxGeometry(1, 2000, 1 );

    let loc = 0;
    
    for(let k=0; k<28;k++){
	for(let i=1;i<16;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 ), 0, (Math.random()-0.5))

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/180
	    let r1 = 20 + 55*i
	    let r2 = 20 + 60*i
	    let r3 = 20 + 20*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 0, r2 *Math.cos(ang) )
	    scene.add(bamboo[loc])
	    loc++; 
	}
    }
    */
    
    camera.position.z = 10;


    renderer2 = new THREE.WebGLRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer2.domElement ); 

     window.addEventListener( 'resize', onWindowResize);
    
    const renderScene = new RenderPass( scene, camera );
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.5;
    bloomPass.strength = 0.2;
    bloomPass.radius = 0.4;
    
    composer = new EffectComposer( renderer2 );
    composer.addPass( renderScene );
    // composer.addPass( bloomPass );

    controls = new OrbitControls( camera, renderer2.domElement );
    controls.maxDistance = 300;
    
    animate();

    
}
function animate() {

    requestAnimationFrame( animate );
    
    var time2 = Date.now() * 0.0005;

    light1.position.x = Math.sin( time2 * 0.3/2 ) * 14;
    light1.position.y = Math.cos( time2 * 0.7/2 ) * 10;
    light1.position.z = Math.cos( time2 * 0.3/2 ) * 14 ;

    light2.position.x = Math.cos( time2 * 0.7/2 ) * -14;
    light2.position.y = Math.sin( time2* 0.3/2 ) * -10;
    light2.position.z = Math.cos( time2 * 0.3/2 ) * -14;

    vit.needsUpdate = true; 

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.002;

    ring.rotation.z -= 0.01; 
    ring2.rotation.z += 0.02; 
    ring3.rotation.z -= 0.03; 
    renderer2.render( scene, camera );
    composer.render();

    if (retroBool ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );	
	renderer2.copyFramebufferToTexture( vector, texture );
    }


};

function onWindowResize() {

    
    //windowHalfX = window.innerWidth / 2;
    //windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer2.setSize( window.innerWidth, window.innerHeight );
    
}

function retro() {
    // const data = new Uint8Array( textureSize * textureSize * 3 );
    texture = new THREE.FramebufferTexture( textureSize, textureSize, THREE.RGBAFormat );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
}

function retrorm(){
    scene.remove( cuboGrande ); 
}

function retroadd(){
    scene.add( cuboGrande ); 
}
