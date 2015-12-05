
var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var model;
var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;
 
var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
 
var mouseX = 0;
var mouseXOnMouseDown = 0;
 
var mouseY = 0;
var mouseYOnMouseDown = 0;

var handArr=[];
var skeletonArr=[];
var liverArr=[];
var lungsArr=[];
var eyeArr=[];

var totalMaterials=0;

var prevSliderVal=0;


var initalRotationX;
var initalRotationY;
var initalPostionX;
var initialPostionY;


init();
animate();


function init() {

   console.log("new");
    container = document.createElement( 'div' );
    document.getElementById("modelContainer").appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 200;

    // scene

    scene = new THREE.Scene();

   
    var ambient = new THREE.AmbientLight( 0xffffff);
    scene.add( ambient );

    var light1 = new THREE.PointLight( 0xffffff, 0.5, 80 );
    light1.position.set( 0, 10, 10 );
    //scene.add(light1);

    var directionalLight = new THREE.DirectionalLight( 0xffffff);
    directionalLight.position.set(0, 1, 0 );
    scene.add( directionalLight );

    // model

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var loader = new THREE.OBJMTLLoader();

    loader.load( 'obj/internal_skeleton/skelet.obj', 'obj/internal_skeleton/skelet.mtl', function ( object ) {

        model=object;
        object.position.y=-70;

        initalRotationX=object.rotation.x;
        initalRotationY=object.rotation.y;
        initalPostionX=object.position.x;
        initalPostionY=object.position.y;

        object.scale.x=2;
        object.scale.y=2;
        object.scale.z=2;

        scene.add( object );

        object.traverse( function ( child ) {

            if ( child.material) {

                //console.log(child.material);
                child.material.transparent=true;
                if(child.material.name=="Liver_045kidney")
                    liverArr.push(child);
                if(child.material.name=="hand")
                    handArr.push(child);
                if(child.material.name=="lungs_045hear")
                    lungsArr.push(child);
                if(child.material.name=="Eye")
                    eyeArr.push(child);
                if(child.material.name=="1")
                    skeletonArr.push(child);

                totalMaterials++;
               // "1"
               
                //materialArr.push(child);
                
            }
        });   
        setSlider();

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer();
    var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    var WW = window.innerWidth;
    var HH = window.innerHeight;
    renderer.setSize( WW, HH ); 

    renderer.setViewport( (WW-WW*DPR)/2, (HH-HH*DPR)/2, WW*DPR, HH*DPR );
    renderer.setClearColor( 0xcccccc);

    container.appendChild( renderer.domElement );

    var mouseDownTarget=document.getElementById("modelContainer");
    mouseDownTarget.addEventListener( 'mousedown', onDocumentMouseDown, false );

    //

     window.addEventListener( 'resize', onWindowResize, false );

    

    }   

            
          
            //

function animate() {

    requestAnimationFrame( animate );
    render();

    }


function render() {

    if(model)
    {
      model.rotation.y  += ( targetRotationX - model.rotation.y  ) * 0.1;
      model.rotation.x  += ( targetRotationY - model.rotation.x  ) * 0.1;
    }

      renderer.render( scene, camera );

}


/*

*************************Event Handlers ************************************************************

*/


function onWindowResize() {

                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

    }

function onDocumentMouseDown( event ) {
        
        console.log("inmousedown");
        event.preventDefault();
 
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', onDocumentMouseOut, false );
 
        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;
 
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
 
    }
     
function onDocumentMouseMove( event ) {
        
        //console.log( scene.rotation.y);
        //rotateCube();
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
 
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
 
    }
     
function onDocumentMouseUp( event ) {
 
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
 
    }
 
function onDocumentMouseOut( event ) {
 
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
 
    }



function onMoveControls(){

     //alert("Init called"+event.target+";;"+this.id);
     switch(this.id){
        case "top":
            calculateMovementY(false);
            break;

        case "left":
            calculateMovementX(false);
            break;

        case "right":
            calculateMovementX(true);
            break;

        case "bottom":
            calculateMovementY(true);
            break;

        case "plus":
                model.scale.x+=.5;
                model.scale.y+=.5
                model.scale.z+=.5;
            break;

        case "minus":
                if( model.scale.x > 1){
                    model.scale.x-=.5;
                    model.scale.y-=.5;
                    model.scale.z-=.5
                }
                
            break;

        case "home":
            transparencyHandler();
            break;

     }
}


function calculateMovementX(myFlag){

    if(myFlag==true){
        mouseXOnMouseDown = model.rotation.y - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseX = (model.rotation.y+20)  - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;

        model.rotation.y  += ( targetRotationX - model.rotation.y  ) * 0.1;

    }
    else{
        mouseXOnMouseDown = model.rotation.y - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseX = (model.rotation.y-20)  - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;

        model.rotation.y  += ( targetRotationX - model.rotation.y  ) * 0.1;
    }
    
    console.log(model.rotation.y);
}


function calculateMovementY(myFlag){


     if(myFlag==true){

        model.position.y-=20;
    }
    else{
        
        model.position.y+=20;
    }

}


function transparencyHandler(){

       
        model.rotation.x= initalRotationX;
        model.rotation.y=initalRotationY;
        targetRotationX = model.rotation.y;
        targetRotationY = model.rotation.x;  
        model.position.x=initalPostionX;
        model.position.y=initalPostionY;

        model.scale.x=2;
        model.scale.y=2;
        model.scale.z=2;

}


function setSlider(){

     console.log("materialArr.length"+totalMaterials);
        $( "#slider" ).slider({
            max : totalMaterials,
            step : Math.round(totalMaterials/5)
        });


        $( "#slider" ).slider({
          change: function( event, ui ) {

            handleTransparency($( "#slider" ).slider("value"));
          }
        });


}
 var flag;

function handleTransparency(currVal){

    console.log(currVal);
   
    if(currVal>=0&&currVal<7){
        
        if(currVal>prevSliderVal){
            showHideMaterials(handArr,true);
        }
        else{

            showHideMaterials(handArr,false);
            showHideMaterials(skeletonArr,false);
            showHideMaterials(liverArr,false); 
            showHideMaterials(lungsArr,false);
            showHideMaterials(eyeArr,false);
        }

        

    }else if(currVal>=7&&currVal<13){
        if(currVal>prevSliderVal){
            showHideMaterials(handArr,true);
            showHideMaterials(skeletonArr,true);
        }
        else{

            showHideMaterials(skeletonArr,false);
            showHideMaterials(liverArr,false); 
            showHideMaterials(lungsArr,false);
            showHideMaterials(eyeArr,false);
        }
        
    }else if(currVal>=13&&currVal<17){
          if(currVal>prevSliderVal){
            showHideMaterials(handArr,true);
            showHideMaterials(skeletonArr,true);
             showHideMaterials(liverArr,true); 
        }
        else{

            showHideMaterials(liverArr,false); 
            showHideMaterials(lungsArr,false);
            showHideMaterials(eyeArr,false);
        }
        
    }else if(currVal>=17&&currVal<21){
          if(currVal>prevSliderVal){
            showHideMaterials(handArr,true);
            showHideMaterials(skeletonArr,true);
             showHideMaterials(liverArr,true); 
              showHideMaterials(lungsArr,true);
        }
        else{

            showHideMaterials(lungsArr,false);
            showHideMaterials(eyeArr,false);
        }
        
    }else if(currVal>=21){
          if(currVal>prevSliderVal){
            showHideMaterials(handArr,true);
            showHideMaterials(skeletonArr,true);
             showHideMaterials(liverArr,true); 
              showHideMaterials(lungsArr,true);
              showHideMaterials(eyeArr,true);
        }else{

         showHideMaterials(eyeArr,false);
       
    }
}

    prevSliderVal=currVal;
        
}


function showHideMaterials(arr,flag){

    for(var i=0;i<arr.length;i++){

        if(flag){
            arr[i].material.opacity=0;
        }
        else{
            arr[i].material.opacity=1;
        }
    }
}