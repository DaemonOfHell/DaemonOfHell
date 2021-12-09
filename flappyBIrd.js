let v = 0;
let g = 30;
let d = 0;
let f = 197;  // force of 1 flap in newton
let m = .5;  // mass of bird in kg

const bgm = new Audio('./res/sounds/bgm.ogg')
const sfx_flap = new Audio('./res/sounds/flap2.wav')
const sfx_gasp = new Audio('./res/sounds/gasp-boy.mp3')
const sfx_fall = new Audio('./res/sounds/cartoonfall3.wav')

bgm.play()

let flapstart = 0
let flapend = 0

let flaptime = flapend - flapstart
// let flapping = false

// console.log(bird);
let gamestop = false 

 
// let startrendertime = 0
let previousrendertime
let timesincelastrender = 0

const pipes = document.createElement('div')
pipes.classList.add('hurdle') 
pipes.innerHTML = '<div id="toppipe"></div><div id="gap"></div><div id="bottompipe"></div>' 
pipes.style.marginLeft = Math.floor(Math.random()*screen.width) + 'px' 
document.getElementById('game').appendChild(pipes) 

const pipes2 = document.createElement('div')
pipes2.classList.add('hurdle') 
pipes2.innerHTML = '<div id="toppipe"></div><div id="gap"></div><div id="bottompipe"></div>' 
pipes2.style.marginLeft = Math.floor(Math.random()*screen.width) + 'px' 
document.getElementById('game').appendChild(pipes2) 
 
const hurdle = document.getElementsByClassName('hurdle') 
  
let birdstyle = bird.currentStyle || window.getComputedStyle(bird) 

const tp = document.getElementById('toppipe')
const bp = document.getElementById('bottompipe')

function main(timestamp){

    if( previousrendertime === undefined){ 
        previousrendertime = timestamp
    }
    timesincelastrender = (timestamp - previousrendertime)/1000
   
    let reqframe = window.requestAnimationFrame(main) 

    if(gamestop){
        bgm.pause()  
        window.cancelAnimationFrame(reqframe)
        if(confirm('game over. Retry ?')){
            window.location = '/'
        }else{
            return
        } 
    }
    else if(parseInt(pipes.style.marginLeft.replace('px','')) <= -50){
         
        console.log('looping'); 
        hurdle[0].style.marginLeft = screen.width+'px'
    }
    else if(parseInt(pipes2.style.marginLeft.replace('px','')) <= -50){
         
        console.log('looping'); 
        hurdle[1].style.marginLeft = screen.width+'px'
    }

    hurdle[0].style.marginLeft = parseInt(pipes.style.marginLeft.replace('px','')) - 2 +'px'
    hurdle[1].style.marginLeft = parseInt(pipes2.style.marginLeft.replace('px','')) - 2 +'px'

    if(flaptime > 0){
        v = gravity() + flap()  
    }
    else{
        v = gravity()
    } 
    checkgameover()

    previousrendertime = timestamp
}

function gravity(){ 
    d = Math.floor(v) 
    // bird.style.marginTop = birdstyle.marginTop + 9 + 'px'
    v = v + g * timesincelastrender
    bird.style.marginTop = parseInt(birdstyle.marginTop.replace('px','')) + d + 'px'
    // console.log(timesincelastrender+' : ' +d);
return v
}

function flap(){ 
    v =  -(f*timesincelastrender)/m  
return v 
}

function stopgame(){
    gamestop = true
}

function checkgameover(){
 
    if(parseInt(birdstyle.marginTop.replace('px','')) > screen.height){
        let choice;
        sfx_fall.play()
        gamestop = true
        document.getElementById('game').innerHTML = 'gameover' 
    } 
    collision()
}

function collision(){
    // let birdstyle = bird.currentStyle || window.getComputedStyle(bird) 

let birdrect = bird.getBoundingClientRect()
    
let pipe_1 = tp.getBoundingClientRect();
let pipe_2 = bp.getBoundingClientRect();

console.log(birdrect.height, birdrect.width); 
    if(birdrect.top + birdrect.width/3 < pipe_1.bottom && birdrect.right - birdrect.width/3 > pipe_1.left &&
        birdrect.left + birdrect.width/3 < pipe_1.right ){  
        gamestop = true
        // bird.style.height = '5vmin'
        sfx_gasp.play()
    }
    if(birdrect.bottom - birdrect.width/3 > pipe_2.top && birdrect.right - birdrect.width/3 > pipe_2.left &&
        birdrect.left + birdrect.width/3 < pipe_2.right ){  
        gamestop = true
        // bird.style.height = '5vmin'
        sfx_gasp.play()
    }
  
}


window.requestAnimationFrame(main)

window.addEventListener('mousedown',()=>{
    flapstart = new Date().getMilliseconds
    // flapping = true
     sfx_flap.play()
})

window.addEventListener('dblclick',()=>{
    // sfx_flap.play()
    f = 480
    flapstart = new Date().getMilliseconds
    // flapping = true
})

window.addEventListener('mouseup',()=>{
    // sfx_flap.play()
    flapend = new Date().getMilliseconds
    f = 197
    // flapping = false
})