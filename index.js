import * as Tone from 'tone';
import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';
import { ImprovedNoise } from './jsm/math/ImprovedNoise.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js';
import { OBJLoader } from './jsm/loaders/OBJLoader.js';

const osc = new OSC();
osc.open();

document.body.style.cursor = 'none'; 

let renderer2, scene, camera, composer, controls; 

let cube, ring, ring2, ring3;

let switchHydra = 0, switchModel = 0; 

/*
let loader = new GLTFLoader();
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/js/draco/' );
loader.setDRACOLoader( dracoLoader );
*/

let object; 

let texture;
let dpr = window.devicePixelRatio; 
let textureSize = 1024 * dpr;
const vector = new THREE.Vector2();

let materialC2;
let audioSphere; 
let cuboGrande, cuboGrandeCopy; 

let retroBool = true;
let gamepads; 

let light1, light2, light3, light4; 

let bamboo = []; 

let cubos = [];

let pX = [], pY = [], pZ = []; 

let total = 256;

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false
})
    
// shape(4,0.7).mult(osc(5,-0.001,9).modulate(noise(3,1)).rotate(10), 1).modulateScale(osc(4,-0.03,0).kaleid(50).scale(0.6),15,0.1).out()
    
osc(20, 0.01, 0.5)
    // .color(0.85, 0.85, 0.85)
    .kaleid(7)
    .rotate(1, 0.1)
    .modulate(o0, () => (mouse.x * 0.0003))
    .scale(1.01)
    .out(o0)
    
const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none'; 
    
let vit = new THREE.CanvasTexture(elCanvas);

Tone.start().then(init()); 

let an, mic; 
let anSphere = false, anObject = false; 

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // scene.fog = new THREE.Fog(0x000000, 10, 960);

    retro();

    audio(); 
    // scene.background = new THREE.Color( 0x000000 ); 
    
    //const geometry = new THREE.BoxGeometry(3, 3, 3);
    const geometry = new THREE.SphereGeometry(15, 2, 3 );
    // Buffergeometry 
    // console.log(geometry.attributes.position); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture } );

    for(let i = 0; i < total; i++){
  
	cubos[i] = new THREE.Mesh( geometry, material );

	var posX, posY, posZ;
	
	var theta1 = Math.random() * (Math.PI*2);
	var theta2 = Math.random() * (Math.PI*2); 

	posX = Math.cos(theta1) * Math.cos(theta2);
	posY = Math.sin(theta1);
	posZ = Math.cos(theta1) * Math.sin(theta2);

	pX[i] = posX;
	pY[i] = posY;
	pZ[i] = posZ; 
	
	cubos[i].position.x = pX[i] * 200; 
	cubos[i].position.y = pY[i] * 200;
	cubos[i].position.z = pZ[i] * 200;

	cubos[i].rotation.x = Math.random() * 360; 

	cubos[i].rotation.y = Math.random() * 360; 

	cubos[i].rotation.z = Math.random() * 360; 
	
	scene.add( cubos[i] );
	
    }

    const loader = new OBJLoader( );
    loader.load( '3d/3d.obj', function ( obj ) {	
	object = obj;
	
    });

    oscFuncs; 
    
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
	map: vit,
	side: THREE.DoubleSide,
	//roughness: 0.8,
	// metalness: 0.2
	// transparent: true,
	// color: diffuseColor,
	// reflectivity: beta,
	// envMap: alpha < 0.5 ? reflectionCube : null
    } );

    
    audioSphere = new THREE.SphereGeometry( 500, 32, 32 );
    // audioSphere = new THREE.CylinderGeometry( 500, 500, 500, 6 );
    // audioSphere = new THREE.BoxGeometry( 1000, 500, 1000, 16, 16, 16 )
    audioSphere.usage = THREE.DynamicDrawUsage;
	
    audioSphere.computeBoundingBox();	  
  
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeCopy = new THREE.Mesh(audioSphere.clone(), materialC2 );
   
    cuboGrande.geometry.usage = THREE.DynamicDrawUsage;
	    
   scene.add(cuboGrande);
   
    let pilaresMaterial = new THREE.MeshBasicMaterial( {
	color: 0x000000,
	// envMap: vit,
	// refractionRatio: 0.75,
	// roughness: 0.4,
	// metalness: 0.8,
	//map: texture
    } );
    
    const pilargeom = new THREE.BoxGeometry(0.5, 1000, 0.5 );

    let loc = 0;
     for(let k=0; k<18;k++){
	for(let i=1;i<6;i++){

	    bamboo[loc] = new THREE.Mesh(pilargeom, pilaresMaterial )
	    // bamboo[loc].rotation.set((Math.random()- 1 )/2, 0, (Math.random()-1)/2)
	    bamboo[loc].rotation.set((Math.random()- 0.5 )/2, 0, (Math.random()-0.5)/2)

	    let ang = (k * 10 + ((i+1)%3)* 3 + i) * 2 * Math.PI/100
	    let r1 = 22 + 56*i
	    let r2 = 21 + 52*i
	    
	    bamboo[loc].position.set(r1 * Math.sin(ang), 10, r2 *Math.cos(ang) )
	    // scene.add(bamboo[loc])
	    loc++; 
	}
    }
    
    camera.position.z = 10;


    renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer2.domElement ); 

     window.addEventListener( 'resize', onWindowResize);
    
    const renderScene = new RenderPass( scene, camera );
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.3;
    bloomPass.strength = 0.1; // parametrizable 
    bloomPass.radius = 0.8;
    
    composer = new EffectComposer( renderer2 );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );

    controls = new OrbitControls( camera, renderer2.domElement );
    controls.maxDistance = 300;
    
    animate();

    
}
function animate() {

    requestAnimationFrame( animate );

    var time2 = Date.now() * 0.005;
    var time = Date.now() * 0.00001;

    let perlin = new ImprovedNoise();
 
    for( var i = 0; i < total; i++){
	
	let d = perlin.noise(pX[i]*(Tone.dbToGain(an.getValue()[i%16] )*100)+time,
			     pY[i]*(Tone.dbToGain(an.getValue()[i%16] )*100)+time,
			     pZ[i]*(Tone.dbToGain(an.getValue()[i%16] )*100)+time ) * 0.5

	cubos[i].position.x = (pX[i]*200)* (1+d);
	cubos[i].position.y = (pY[i] *200)* (1+d);
	cubos[i].position.z = (pZ[i]* 200)* (1+d);

	cubos[i].scale.x = 1* (d)*16;
	cubos[i].scale.y = 1* (d)*16;
	cubos[i].scale.z = 1* (d)*16;

	cubos[i].rotation.x = 1* (d)*16;
	cubos[i].rotation.y = 1* (d)*16;
	cubos[i].rotation.z = 1* (d)*16;
	
	
    }

    for ( var i = 0; i < cuboGrande.geometry.attributes.position.count; i++){

	let d = perlin.noise( cuboGrande.geometry.attributes.position.getX(i)*(Tone.dbToGain(an.getValue()[i%16] )*0.1)+time,
			      cuboGrande.geometry.attributes.position.getY(i)*(Tone.dbToGain(an.getValue()[i%16] )*0.1)+time,
			      cuboGrande.geometry.attributes.position.getZ(i)*(Tone.dbToGain(an.getValue()[i%16] )*0.1)+time ) * 0.5

	cuboGrande.geometry.attributes.position.setX(
	    i, (cuboGrandeCopy.geometry.attributes.position.getX(i)) * (1+d)
	);
	cuboGrande.geometry.attributes.position.setY(
	    i, cuboGrandeCopy.geometry.attributes.position.getY(i) * (1+d)
	);
	cuboGrande.geometry.attributes.position.setZ(
	    i, cuboGrandeCopy.geometry.attributes.position.getZ(i) * (1+d)
	);
	
	
    }

    cuboGrande.geometry.attributes.position.needsUpdate = true; 
    
    camera.position.x = Math.sin( time2 * 0.125/4 ) * ( 75 + Math.sin( time2 * 0.125 )* 4) * 1; 
    camera.position.y = Math.cos( time2 * 0.125/4 ) * 200; 
    camera.position.z = Math.cos( time2 * 0.125/4 ) * - 200;
    camera.lookAt(0, 0, 0);
   
    /*
    light1.position.x = Math.sin( time2 * 0.3/2 ) * 14;
    light1.position.y = Math.cos( time2 * 0.7/2 ) * 10;
    light1.position.z = Math.cos( time2 * 0.3/2 ) * 14 ;

    light2.position.x = Math.cos( time2 * 0.7/2 ) * -14;
    light2.position.y = Math.sin( time2* 0.3/2 ) * -10;
    light2.position.z = Math.cos( time2 * 0.3/2 ) * -14;

    */
    
    vit.needsUpdate = true; 

    for(let i = 0; i < total; i++){
	cubos[i].rotation.y += 0.005; 
    }
    
    //cube.rotation.x += 0.001;
    //cube.rotation.y += 0.002;

    // camera.rotation.x +- 0.01; 
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

function oscFuncs(){
    
    osc.on('/switchHydra', message => {
	
	swtichHydra = message.args[0];
	hush();

	switch( switchHydra ) {
	case 0:
	    // algo 
	    break;
	case 1:
	    // otro algo
	    break; 
	    
	}
	
	console.log(switchHydra); 
    })

     osc.on('/switchModel', message => {

	 swtichModel = message.args[0];

	 // disposear las cosas 
	 
	switch( model ) {
	case 0:
	    // algo 
	    break;
	case 1:
	    // otro algo
	    break; 
	    
	}

	 console.log(switchModel); 
    })

    osc.on('/cubos', message => {
	if(cubos){
	    for( var i = 0; i < total; i++){
		scene.add(cubos[i]);
	    }
	} else {
	    for( var i = 0; i < total; i++){
		scene.remove(cubos[i]);
	    }
	}  
    });

    osc.on('/bloom', message => {
	bloomPass.strength = message.args[0];
    });

    osc.on('/retroB', message => {
	retroBool = message.args[0];
	// console.log( retroBool );
	if(retroBool){
	    retroadd();
	} else {
	    retrorm(); 
	}
    });
    
}

function audio(){
    
    an = new Tone.Analyser('fft', 32 );
    an.smoothing = 0.8
    const mic = new Tone.UserMedia().connect( an );
    mic.open();
    
}
