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
import { GlitchPass } from './jsm/postprocessing/GlitchPass.js';

let glitchPass;

const osc2 = new OSC();
osc2.open();

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
let sph; 

let retroBool = true;
let gamepads; 

let light1, light2, light3, light4; 

let bamboo = []; 

let cubos = [];

let pX = [], pY = [], pZ = []; 
let mX = 1000, mY = 10; 

let total = 100;

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false,
    makeGlobal: false
}).synth

var hydra2 = new Hydra({
    canvas: document.getElementById("myCanvas2"),
    detectAudio: false,
    makeGlobal: false
}).synth


/*
hydra.osc(10, 0.1, 0)
    //.color(0.9, 0.9, 2)
    .kaleid(5)
    .rotate(10, 0.1)
    .modulate(hydra.o0, () => (1000 * 0.0003))
    .scale(1.01)
    .out(hydra.o0)
*/
//shape(4,0.7).mult(osc(5,-0.001,9).modulate(noise(3,1)).rotate(10), 1).modulateScale(osc(4,-0.03,0).kaleid(50).scale(0.6),15,0.1).out()

// hydra2.noise().out(hydra2.o0); 
// hydra.osc(10).out(hydra.o0);
hydra.src(hydra.o0).modulateHue(hydra.src(hydra.o0).scale(1.5),[1,2].smooth()).layer(
  hydra.osc(10,.1,9).mask(hydra2.shape(99,[.1,.2].smooth(),0))
  .rotate(0,3)
  .scrollY(.1,[.1,.2,.3,.4].smooth())
  .scrollX(.1,.1)
  .kaleid([2,3,4,3,2].smooth())
  .rotate(0,2)
).out(hydra.o0)

const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none';     
let vit = new THREE.CanvasTexture(elCanvas);

const elCanvas2 = document.getElementById( 'myCanvas2');
elCanvas2.style.display = 'none';     
let vit2 = new THREE.CanvasTexture(elCanvas2);


Tone.start().then(init()); 

let an, mic; 
let anSphere = false, anObject = false; 
let vertices = []; 
let boolMesh = true; 
let meshFinal; 
let plane; 
let torus1; 
let torus2;
let torus3, torus4, torus5; 
let meshFinal2; 

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );

    // scene.fog = new THREE.Fog(0x000000, 10, 960);

    
    const video = document.getElementById( 'video' );
    const textureV = new THREE.VideoTexture( video );
    video.play();

    const light = new THREE.PointLight( 0xffffff, 1 );
    light.position.y = 10;
    light.position.x = 1; 
    scene.add( light );

    retro();
    audio(); 
    // scene.background = new THREE.Color( 0x000000 ); 
    
    //const geometry = new THREE.BoxGeometry(3, 3, 3);
    const geometry = new THREE.SphereGeometry(5, 4, 3 );
    // Buffergeometry 
    // console.log(geometry.attributes.position); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texture,  side: THREE.DoubleSide } );

    const material222 = new THREE.MeshBasicMaterial( { color: 0xffffff, map:textureV,  side: THREE.DoubleSide } );

    
    for(let i = 0; i < total; i++){
  
	cubos[i] = new THREE.Mesh( geometry, material222 );

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
    
    const geometryP = new THREE.PlaneGeometry( 16*100, 16*100, 16, 16 );
    const materialP = new THREE.MeshBasicMaterial( {
	color: 0xd9e1f9,
	// emissive: 0x4b0f61,
	side: THREE.DoubleSide,
	//roughness: 0.1,
	// metalness: 0.7,
	wireframe: true,
	wireframeLinewidth: 2,
	// blendingMode: THREE.AdditiveBlending
    } );

    plane = new THREE.Mesh( geometryP, materialP );
    plane.rotation.x = Math.PI/2;

    geometryP.attributes.position.needsUpdate = true;
    // geometry2.computeVertexNormals(); 
    
    for(let i = 0; i < geometryP.attributes.position.count; i++){
	geometryP.attributes.position.setZ(i, Math.random() * 40);
    }

    plane.position.y = -10; 
    // plane.position.z = -100;
    const geometryBasic = new THREE.PlaneGeometry( 80, 80, 32, 32 );

    
    const materialBasic = new THREE.MeshBasicMaterial({ color: 0xffffff, 
							side: THREE.DoubleSide,
							map: textureV,
							//roughness: 0.5,
							//metalness: 0.2
						      })
    
    const plane2 = new THREE.Mesh(geometryBasic, materialBasic);

    // scene.add( plane2 );     
    scene.add( plane );

    // let geometryTor = []; 
    const materialTor = new THREE.MeshStandardMaterial( { color:  0xd9e1f9, roughness: 0.6, metalness: 0.9 } );
    const geometryTor = new THREE.TorusGeometry( 60, 1.25, 32, 100 );
    const geometryTor2 = new THREE.TorusGeometry(40, 1.25, 32, 100 );
    const geometryTor3 = new THREE.TorusGeometry(20, 1.25, 32, 100 );
    const geometryTor4 = new THREE.TorusGeometry(80, 1.25, 32, 100 );
    const geometryTor5 = new THREE.TorusGeometry(100, 1.25, 32, 100 );

    torus1 = new THREE.Mesh( geometryTor, materialTor );
    torus2 = new THREE.Mesh( geometryTor2, materialTor );
    torus3 = new THREE.Mesh( geometryTor3, materialTor );
    torus4 = new THREE.Mesh( geometryTor4, materialTor );
    torus5 = new THREE.Mesh( geometryTor5, materialTor );

    torus1.position.x = 50;
    torus1.position.z = 50; 
    scene.add( torus1 );

    torus2.position.x = 50;
    torus2.position.z = 50; 
    scene.add( torus2 );
    
    torus3.position.x = 50;
    torus3.position.z = 50; 
    scene.add( torus3 );

    torus4.position.x = 50;
    torus4.position.z = 50; 
    scene.add( torus4 );

    torus5.position.x = 50;
    torus5.position.z = 50; 
    scene.add( torus5 );

    
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

	
    const sphGeom = new THREE.SphereGeometry( 20, 64, 64 );
    sph = new THREE.Mesh(sphGeom, materialC2); 
    
    audioSphere = new THREE.SphereGeometry( 1500, 64, 64 );
    // audioSphere = new THREE.CylinderGeometry( 500, 500, 500, 6 );
    //audioSphere = new THREE.BoxGeometry( 500, 500, 500, 32, 32, 32 )
    audioSphere.usage = THREE.DynamicDrawUsage;
	
    audioSphere.computeBoundingBox();	  
  
    cuboGrande = new THREE.Mesh(audioSphere, material );
    cuboGrandeCopy = new THREE.Mesh(audioSphere.clone(), material );

    // materialC2.depthTest = false; 
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

    /*
    const loader = new OBJLoader();

    loader.load(
	'3d/objeto.obj',
	function ( object ) {
	    console.log(object.children[0]); 
	    obj = object.children[0];
	    obj.material = materialC2;
	    // obj.geometry = THREE.BufferGeometryUtils.mergeVertices(obj.geometry);
	    obj.geometry.computeVertexNormals(true); 
	    scene.add( obj );
	}
	);
    */

    let vertices = [];
    let normales = []; 
    const cantidad = 1000;
    
    for(let i = 0; i < cantidad; i++){
	for(let j = 0; j < cantidad; j++){

	    /*
	    let lat = THREE.MathUtils.mapLinear(i, 0, cantidad,  -Math.PI, Math.PI);
	    let lon = THREE.MathUtils.mapLinear(j, 0, cantidad, -Math.PI, Math.PI);
	    */

	    let lat = THREE.MathUtils.mapLinear(i, 0, cantidad,  -Math.PI/4, Math.PI);
	    let lon = THREE.MathUtils.mapLinear(j, 0, cantidad, -Math.PI, Math.PI);
	    
	    
	    let x = 1.5 * Math.cos(lat) * (1.5 + Math.sin(lon) * Math.cos(lat) - Math.sin(4*lon) * Math.sin(lat) / 2);
            let y = 1.5 * Math.sin(lat) * (1.5 + Math.sin(lon) * Math.cos(lat) - Math.sin(4*lon) * Math.sin(lat) / 2) ;
            let z = 1.5 * Math.sin(lat) * Math.sin(lon) + Math.cos(lat) * Math.sin(2*lon) / 2 ;
	    

	    /*
	    let x =  1 * Math.cos(lat) * Math.cos(lon);
	    let y =  1 * Math.sin(lat) * Math.cos(lon);
	    let z =  1 * Math.sin(lon) + 1*lat;  
	    */
	    vertices.push(x, y, z);
	   
	}
    }

    const geometry2 = new THREE.PlaneGeometry( 5, 5, cantidad, cantidad);

    
    meshFinal = new THREE.Mesh(geometry2, materialC2 );
    meshFinal.scale.x = 64; 
    meshFinal.scale.y = 64; 
    meshFinal.scale.z = 64; 

    meshFinal.position.x = -100;
    meshFinal.position.z = -100; 
    // meshFinal.position.y = -50; 
    
    scene.add(meshFinal); 
    
    geometry2.attributes.position.needsUpdate = true;
    // geometry2.computeVertexNormals(); 

    for(let i = 0; i < geometry2.attributes.position.count; i++){
	geometry2.attributes.position.setX(i, vertices[i*3]);
	geometry2.attributes.position.setY(i, vertices[i*3+1]); 
	geometry2.attributes.position.setZ(i, vertices[i*3+2]); 
    }

    ///////////////////////////// segundo mesh
    
    let vertices2 = [];
    
    for(let i = 0; i < cantidad; i++){
	for(let j = 0; j < cantidad; j++){

	    /*
	    let lat = THREE.MathUtils.mapLinear(i, 0, cantidad,  -Math.PI, Math.PI);
	    let lon = THREE.MathUtils.mapLinear(j, 0, cantidad, -Math.PI, Math.PI);
	    */

	    let lat = THREE.MathUtils.mapLinear(i, 0, cantidad,  -Math.PI/4, Math.PI);
	    let lon = THREE.MathUtils.mapLinear(j, 0, cantidad, -Math.PI, Math.PI);
	    
	    
	    
	    let x =  1 * Math.cos(lat) * Math.cos(lon);
	    let y =  1 * Math.sin(lat) * Math.cos(lon);
	    let z =  1 * Math.sin(lon) + 1*lat;  
	   
	    vertices2.push(x, y, z);
	   
	}
    }

    const geometry3 = new THREE.PlaneGeometry( 5, 5, cantidad, cantidad);

    
    meshFinal2 = new THREE.Mesh(geometry3, materialC2 );
    meshFinal2.scale.x = 64; 
    meshFinal2.scale.y = 64; 
    meshFinal2.scale.z = 64;

    meshFinal2.rotation.x = Math.PI/2; 

    meshFinal2.position.x = -100;
    meshFinal2.position.z = 100; 
    // meshFinal.position.y = -50; 
    
    scene.add(meshFinal2); 
    
    geometry3.attributes.position.needsUpdate = true;
    // geometry2.computeVertexNormals(); 

    for(let i = 0; i < geometry2.attributes.position.count; i++){
	geometry3.attributes.position.setX(i, vertices2[i*3]);
	geometry3.attributes.position.setY(i, vertices2[i*3+1]); 
	geometry3.attributes.position.setZ(i, vertices2[i*3+2]); 
    }

    ///////////////////// final segundo mesh 
    
    // console.log(vertices); 
    // scene.add(meshFinal); 
    
    // renderer2 = new THREE.WebGLRenderer({ antialias: true });
    renderer2 = new THREE.WebGLRenderer();

    renderer2.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer2.domElement ); 

     window.addEventListener( 'resize', onWindowResize);
    
    const renderScene = new RenderPass( scene, camera );
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.4;
    bloomPass.strength = 0.1; // parametrizable 
    bloomPass.radius = 0.1;
    
    composer = new EffectComposer( renderer2 );
    composer.addPass( renderScene );
    //composer.addPass( bloomPass );
    glitchPass = new GlitchPass();
    composer.addPass( glitchPass );

    controls = new OrbitControls( camera, renderer2.domElement );
    controls.maxDistance = 1000;

    osc2.on('/switchHydra', message => {

	hydra.hush();
	
	switch(  0 ) {
	case 0:
	   
	    hydra.osc(20, 0.1, 0)
	    // .color(0.85, 0.85, 0.85)
		.kaleid(10)
		.rotate(10, 0.1)
		.modulate(hydra.o0, () => (1000 * 0.0003))
		.scale(1.1)
		.out(hydra.o0)
	    break;
	case 1: 
	    voronoi(8,1)
		.mult(osc(10,0.1,0.2))
		.modulate(o0,0.5)
		.add(o0,0.8)
		.scrollY(-0.01)
		.scale(0.99)
		.modulate(voronoi(8,1),0.008)
		.luma(()=>mX*0.0009) 
		.out()
	    break;
	case 2:
	    osc(5, 0.9, 0.00)
		.kaleid([3,4,5,7,8,9,10].fast(0.1))
		.rotate(0.009,()=>Math.sin(time)* -0.0001 )
		.modulateRotate(o0,()=>Math.sin(time) * 0.0003)
		.modulate(o0, ()=>mX*0.0009)
	    //  .scale(()=>mouse.y*0.0009) //cambiar X
		.scale(.99) //scala estática
		.out(o0)
	    break;
	case 3:
	    osc(5)
		.modulate(noise(6),.22).diff(o0)
		.modulateScrollY(osc(0.8).modulate(osc(10).modulate(osc(2,0.1),()=>mX*0.01).rotate(),.91))
		.scale(.79)
		.out()
	    break;
	case 4:
	    osc(105).rotate(0.11, 0.1).modulate(osc(10).rotate(0.3).add(o0, 0.1)).add(osc(20,0.01,0)).out(o0)
	    osc(50,0.005).diff(o0).modulate(o1,()=>mX*0.00009).out(o1)
	    render(o1)
	    break;
	case 5:
	    voronoi(350,0.15)
		.modulateScale(osc(8).rotate(Math.sin(time)),.5)
		.thresh(.8)
		.modulateRotate(osc(7),.4)
		.thresh(.7)
		.diff(src(o0).scale(1.8))
		.modulateScale(osc(2).modulateRotate(o0,.74))
		.diff(src(o0).rotate([-.012,.01,-.002,0]).scrollY(0,[-1/199800,0].fast(0.7)))
		.brightness([-.02,-.17].smooth().fast(.5))
		.out()
	    break;
	case 6:
	    shape(20,0.11,0.3)
		.scale(.9)
		.repeat(() => Math.sin(time)*100)
		.modulateRotate(o0)
		.scale(()=>mX*0.01)
		.modulate(noise(10,2))
		.rotate(1, .2)
		.layer(o0,0.1)
		.modulateScrollY(noise(3),-0.1)
		.scale(0.999)
		.modulate(voronoi(1,1),0.08)
		.out(o0)
	    break;
	case 7:
	    shape(8,0.5)
		.scale(0.3,3)
		.rotate(-1.3)
		.scrollY(0,-0.3)
		.repeat(2,2, ()=>Math.sin(time)*4,()=>Math.sin(time)*4)
		.add(src(o0)
   		     .scrollY(0.001),0.99)
		.scale(1.01)
		.layer(src(o0)
     		       .mask(shape(3,() => Math.sin(time)*0.5+0.8,-0.001)
           		     .rotate(0,2).scale(0.5,0.5))
     		       .shift([0,-0.001].fast(0.1),0,[-0.001,0.001])
		       .colorama([0.001,0.002,0.008,-0.009].fast(0.5))
     		       .scrollY(-0.005))
		.blend(o0,0.4)
		.saturate([1,0.8])
		.out()
	    break;
	case 8:
	    solid().out();
	    break; 
	    
	}
	
	console.log(message.args[0]); 
    })

    osc2.on('/cubos', message => {
	if(message.args[0]){
	    for( var i = 0; i < total; i++){
		scene.add(cubos[i]);
	    }
	} else {
	    for( var i = 0; i < total; i++){
		scene.remove(cubos[i]);
	    }
	}  
    });

    osc2.on('/bloom', message => {
	bloomPass.strength = message.args[0];
    });

    
    osc2.on('/sph', message => {
	if(message.args[0]){
	    scene.add(sph); 
	} else {
	    scene.remove(sph); 
	}
    });

    osc2.on('/retroB', message => {
	retroBool = message.args[0];
	// console.log( retroBool );
	if(retroBool){
	    retroadd();
	} else {
	    retrorm(); 
	}
    });

    osc2.on('/meshFinal', message => {
	boolMesh = message.args[0];
	// console.log( retroBool );
	if(boolMesh){
	    addMesh();
	} else {
	    rmMesh(); 
	}
    });
    
    osc2.on('/camX', message => {
	camera.position.x = message.args[0];
    })

    osc2.on('/camY', message => {
	camera.position.y = message.args[0];
    })

    osc2.on('/camZ', message => {
	camera.position.z = message.args[0];
    })

    osc2.on('/mX', message => {
	mX = message.args[0];
    })

     osc2.on('/mY', message => {
	mY = message.args[0];
    })
    
    animate();

    
}
function animate() {

    requestAnimationFrame( animate );

    var time2 = Date.now() * 0.001;
    var time = Date.now() * 0.0001;
    let perlin = new ImprovedNoise();

    plane.geometry.attributes.position.needsUpdate = true;
    // geometry2.computeVertexNormals(); 
    
    for(let i = 0; i < plane.geometry.attributes.position.count; i++){
	let d = perlin.noise(plane.geometry.attributes.position.getX(i)*0.01+time2,
			     plane.geometry.attributes.position.getY(i)*0.01+time2,
			     plane.geometry.attributes.position.getZ(i)*0.01+time2 ) * 0.5

	plane.geometry.attributes.position.setZ(i, 60*(d+1));
    }

    
    for( var i = 0; i < total; i++){
	
	let d = perlin.noise(pX[i]*4+time,
			     pY[i]*4+time,
			     pZ[i]*4+time ) * 1

	cubos[i].position.x = (pX[i]*200)* (1+d);
	cubos[i].position.y = (pY[i] *200)* (1+d);
	cubos[i].position.z = (pZ[i]* 200)* (1+d);

	cubos[i].scale.x = 4* (d)*4;
	cubos[i].scale.y = 4* (d)*4;
	cubos[i].scale.z = 4* (d)*4;

	cubos[i].rotation.x = 1* (d)*4;
	cubos[i].rotation.y = 1* (d)*4;
	cubos[i].rotation.z = 1* (d)*4;
	
	
    }

    for ( var i = 0; i < cuboGrande.geometry.attributes.position.count; i++){

	let d = perlin.noise( cuboGrande.geometry.attributes.position.getX(i)*0.001+time,
			      cuboGrande.geometry.attributes.position.getY(i)*0.001+time,
			      cuboGrande.geometry.attributes.position.getZ(i)*0.001+time ) * 0.5

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
    
    camera.position.x = Math.sin( time2 * 0.125 ) * ( 65 + Math.sin( time2 * 0.125 )* 4) * 1; 
    camera.position.y = Math.cos( time2 * 0.125 ) * 60; 
    camera.position.z = Math.cos( time2 * 0.125 ) * - 65;
   
    camera.lookAt(0, 0, 0);
   
    /*
    light1.position.x = Math.sin( time2 * 0.3/2 ) * 14;
    light1.position.y = Math.cos( time2 * 0.7/2 ) * 10;
    light1.position.z = Math.cos( time2 * 0.3/2 ) * 14 ;

    light2.position.x = Math.cos( time2 * 0.7/2 ) * -14;
    light2.position.y = Math.sin( time2* 0.3/2 ) * -10;
    light2.position.z = Math.cos( time2 * 0.3/2 ) * -14;

    */
 
    torus5.rotation.x += 0.011/4;
    torus5.rotation.z -= 0.021/4; 
    torus5.rotation.y += 0.031/4; 

    torus4.rotation.x += 0.012/4;
    torus4.rotation.z += 0.022/4; 
    torus4.rotation.y += 0.032/4; 

    torus1.rotation.x -= 0.013/4;
    torus1.rotation.z += 0.023/4; 
    torus1.rotation.y += 0.033/4; 

    torus2.rotation.x -= 0.014/4;
    torus2.rotation.z += 0.024/4; 
    torus2.rotation.y += 0.034/4; 

    torus3.rotation.x -= 0.015/4;
    torus3.rotation.z += 0.015/4; 
    torus3.rotation.y += 0.035/4; 

    meshFinal.rotation.x -= 0.015/8;
    meshFinal.rotation.z += 0.015/8; 
    meshFinal.rotation.y += 0.035/8; 

    meshFinal2.rotation.x -= 0.014/8;
    meshFinal2.rotation.z += 0.014/8; 
    meshFinal2.rotation.y += 0.034/8; 

    
    vit.needsUpdate = true; 
    vit2.needsUpdate = true; 

    for(let i = 0; i < total; i++){
	cubos[i].rotation.y += 0.005; 
    }
    
    // camera.rotation.x +- 0.01; 
   
    // renderer2.render( scene, camera );
    composer.render();

    if (retroBool ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );	
	renderer2.copyFramebufferToTexture( vector, texture );
	renderer2.clearDepth();

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

function addMesh(){
    scene.add(meshFinal); 
}

function rmMesh(){
    scene.remove(meshFinal); 
}

function audio(){
    
    an = new Tone.Analyser('fft', 32 );
    an.smoothing = 0.99
    const mic = new Tone.UserMedia().connect( an );
    mic.open();
    
}
