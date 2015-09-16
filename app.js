var ossmeter = (function(){


  //Declaring the variables
var mycanvas;
var freqlabel;
var vollabel;
var myAudioContext;
var oscillator;
var gainNode;
  
  
  
   //Declaring the Note levels
   var lowNote = 261.63;//c4
   var highNote = 493.88;//b4
  
  
  
   //Declaring the Constructor 
   var ossmeter = function() {


   mycanvas = document.getElementById('osimeter');
   freqlabel = document.getElementById('frequency');
   vollabel = document.getElementById('volume');
     
     

   mycanvas=document.getElementById('osimeter');
   freqlabel=document.getElementById('frequency');
   vollabel=document.getElementById('volume');

   //Creating a new Audio Context
   window.AudioContext = window.AudioContext || window.webkitAudioContext;
   myAudioContext = new window.AudioContext();
   ossmeter.setupEventListeners();
   };
  
  
  
  
   //Adding Event Listeners
   ossmeter.setupEventListeners = function() {

     
     
    //Disables Scrolling on Touch Devices
    document.body.addEventListener('touchmove',function(event) {
       event.preventDefault();
    }, false);
     
    mycanvas.addEventListener('mousedown', ossmeter.playSound);
    mycanvas.addEventListener('touchstart', ossmeter.playSound);
    mycanvas.addEventListener('mouseup', ossmeter.stopSound);
    document.addEventListener('mouseleave', ossmeter.stopSound);
    mycanvas.addEventListener('touchend', ossmeter.stopSound);

   };

   //Generate a sound and play a note
   ossmeter.playSound = function(event){
    oscillator = myAudioContext.createOscillator(); //create a new oscillator
    gainNode = myAudioContext.createGain(); //create a new gain node

    oscillator.type = 'triangle'; //declaring the oscillator type
    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);
    
    ossmeter.updateFrequency(event); //sets note frequency and volume based on the cursor position
    oscillator.start(0); //set to '0' as it starts play immediately after the page is loaded

    mycanvas.addEventListener('mousemove', ossmeter.updateFrequency);
    mycanvas.addEventListener('touchmove', ossmeter.updateFrequency);
    mycanvas.addEventListener('mouseout',   ossmeter.stopSound);


   };
   //To stop the audio
   ossmeter.stopSound = function(event){
    oscillator.stop(0);
    mycanvas.removeEventListener('mousemove',ossmeter.updateFrequency);
    mycanvas.removeEventListener('touchmove',ossmeter.updateFrequency);
    mycanvas.removeEventListener('mouseout',ossmeter.stopSound);
   };

   //Calculating the note frequencies and the volume

     ossmeter.calculateNote = function(posX){    //Functon to calculate note frequency
var noteDifference  = highNote - lowNote;
var noteOffset = ( noteDifference / mycanvas.offsetWidth) * (posX - mycanvas.offsetLeft);
return lowNote + noteOffset;
     };
   //Function to calculate the volume 
   ossmeter.calculateVolume=function(posY) {
     var volumeLevel = 1 - (((100 / mycanvas.offsetHeight) * (posY - mycanvas.offsetTop)) / 100);
  return volumeLevel;
};
  //Fetching the new frequencies and volume 
  ossmeter.calculateFrequency=function(x,y){
    var noteValue=ossmeter.calculateNote(x);
    var volumeValue=ossmeter.calculateVolume(y);
    oscillator.frequency.value=noteValue;
    gainNode.gain.value=volumeValue;

    freqlabel.innerHTML = Math.floor(noteValue) + ' Heartz';
    vollabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };

   //updating the note frequency
   ossmeter.updateFrequency=function(event){
    if(event.type =='mousedown' || event.type =='mousemove'){
      ossmeter.calculateFrequency(event.x, event.y);
    } else if(event.type =='touchstart'||event.type =='touchmove'){
      var Touch = event.touches[0];
      ossmeter.calculateFrequency(Touch.pageX, Touch.pageY);
    }
   };
   //Export Ossimeter
   return ossmeter;

})();

   //Initializing the page
   window.onload = function() {
    
    var oossmeter = new ossmeter();
   } 
