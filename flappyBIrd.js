let v = 0;
let g = 20;
let d = 0;
let f = 108;  // force of 1 flap in newton
let m = .5;  // mass of bird in kg

const bgm = new Audio('./res/sounds/bgm.ogg')
// const sfx_flap = new Audio('./res/sounds/flap2.wav')
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
pipes.innerHTML = '<div class="toppipe"></div><div class="gap"></div><div class="bottompipe"></div>'
pipes.style.marginLeft = Math.floor(Math.random()*screen.width) + 'px' 
document.getElementById('game').appendChild(pipes)  

const pipes2 = document.createElement('div')
pipes2.classList.add('hurdle') 
pipes2.innerHTML = '<div class="toppipe"></div><div class="gap"></div><div class="bottompipe"></div>'
pipes2.style.marginLeft = (pipes.offsetLeft + screen.width/2)+'px' 
document.getElementById('game').appendChild(pipes2) 
    
const bird = document.getElementById('bird')
let birdstyle = bird.currentStyle || window.getComputedStyle(bird) 

const toppipes = document.getElementsByClassName('toppipe')
const gap = document.getElementsByClassName('gap') 
const bottompipes = document.getElementsByClassName('bottompipe') 

function main(timestamp){
    const hurdle = document.getElementsByClassName('hurdle') 
 
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
    else if(pipes.getBoundingClientRect().right < 0){
         
        console.log('looping'); 
        toppipes[0].style.height = Math.floor(Math.random()*screen.height/2) + 'px'
        bottompipes[0].style.height = screen.height - gap[0].style.height - toppipes[0].getBoundingClientRect().bottom + 'px'
        hurdle[0].style.marginLeft = screen.width+'px'
    }
    else if(pipes2.getBoundingClientRect().right < 0){
        toppipes[1].style.height = Math.floor(Math.random()*screen.height/2) + 'px'
        console.log('looping'); 
        bottompipes[1].style.height = screen.height - gap[1].getBoundingClientRect().bottom + 'px'
        hurdle[1].style.marginLeft = screen.width+'px'
    }

    hurdle[0].style.marginLeft = parseInt(pipes.style.marginLeft.replace('px','')) - 2 +'px'
    hurdle[1].style.marginLeft = parseInt(pipes2.style.marginLeft.replace('px','')) - 2 +'px'

    if(flaptime > 0){
        v = gravity() + flap()  
        flapstart = 0
        flapend = 0
    }
    else{
        v = gravity()
    } 
    checkgameover()

    previousrendertime = timestamp
}

function gravity(){ 
    d = Math.floor(v)  
    v = v + g * timesincelastrender
    console.log(timesincelastrender+': '+d);
    bird.style.marginTop = parseInt(birdstyle.marginTop.replace('px','')) + d + 'px'  
return v
}

function flap(){ 
    
    v =  -(f*timesincelastrender)/m  
    new Audio('./res/sounds/flap2.wav').play()
return v 
}

function stopgame(){
    gamestop = true
}

function checkgameover(){
 
    if(parseInt(birdstyle.marginTop.replace('px','')) > screen.height){ 
        sfx_fall.play()
        gamestop = true
        document.getElementById('game').innerHTML = 'gameover' 
    } 
    collision()
}

function collision(){ 

    let birdrect = bird.getBoundingClientRect()
        
    let pipe1top = toppipes[0].getBoundingClientRect();
    let pipe2top = toppipes[1].getBoundingClientRect();
    
    let pipe1bottom = bottompipes[0].getBoundingClientRect();
    let pipe2bottom = bottompipes[1].getBoundingClientRect();
    
    console.log(birdrect.height, birdrect.width); 
        if(birdrect.top + birdrect.width/3 < pipe1top.bottom && birdrect.right - birdrect.width/3 > pipe1top.left &&
            birdrect.left + birdrect.width/3 < pipe1top.right ){  
            gamestop = true
            sfx_gasp.play()
        }
        else if(birdrect.top + birdrect.width/3 < pipe2top.bottom && birdrect.right - birdrect.width/3 > pipe2top.left &&
            birdrect.left + birdrect.width/3 < pipe2top.right ){  
            gamestop = true
            sfx_gasp.play()
        } 
        else if(birdrect.bottom - birdrect.width/3 > pipe1bottom.top && birdrect.right - birdrect.width/3 > pipe1bottom.left &&
            birdrect.left + birdrect.width/3 < pipe1bottom.right ){  
            gamestop = true
            sfx_gasp.play()
        }
        else if(birdrect.bottom - birdrect.width/3 > pipe2bottom.top && birdrect.right - birdrect.width/3 > pipe2bottom.left &&
            birdrect.left + birdrect.width/3 < pipe2bottom.right ){  
            gamestop = true
            sfx_gasp.play()
        }
      
    }


window.requestAnimationFrame(main)

window.addEventListener('mousedown',()=>{
    flapstart = new Date().getMilliseconds
    // flapping = true
     sfx_flap.play()
}) 

window.addEventListener('mouseup',()=>{
    // sfx_flap.play()
    flapend = new Date().getMilliseconds
    // f = 2
    // flapping = false
})