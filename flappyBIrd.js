let score = 0
let cleared = null

let v = 0;
let g = 20;
let d = 0;
let f = 108;  // force of 1 flap in newton
let m = .5;  // mass of bird in kg

const bgm = new Audio('./res/sounds/bgm.ogg')
const sfx_coin = new Audio('./res/sounds/mariocoin.mp3')
const sfx_gasp = new Audio('./res/sounds/metalclunk.wav')
const sfx_fall = new Audio('./res/sounds/cartoonfall3.wav')

const gamestate = {
    birdvelocity: 0,
    flapping: false,
    birdpositionMT: null,
    pipe1positionML: null,
    pipe2positionML: null,
    score: 0,
    timesincelastrender: 0
    // bgmCurrentTime: 0
}

bgm.play()

let flapstart = 0
let flapend = 0

let flaptime = flapend - flapstart
// let flapping = false

// console.log(bird);
let gamestop = false 
let gamepause = false
let gameover = false
 
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

//----------------main func --------------------
function main(timestamp){
    const hurdle = document.getElementsByClassName('hurdle') 
 
    if( previousrendertime === undefined){ 
        previousrendertime = timestamp
    }
    timesincelastrender = (timestamp - previousrendertime)/1000
   
    //fill the gamestate buffer for pausing and resuming
    gamestate.birdpositionMT = bird.getBoundingClientRect().top + 'px'
    gamestate.pipe1positionML = pipes.getBoundingClientRect().left + 'px'
    gamestate.pipe2positionML = pipes2.getBoundingClientRect().left + 'px'
    gamestate.score = score
    gamestate.timesincelastrender = timesincelastrender 
    gamestate.birdvelocity = v
    gamestate.flapping = (flaptime > 0)?true:false
    // gamestate.bgmCurrentTime = bgm.currentTime

    let reqframe = window.requestAnimationFrame(main) 
    if(gameover){
        bgm.pause()    
        stopgame()
        document.getElementById('gameoverscreen').style.visibility = 'revert';
        window.cancelAnimationFrame(reqframe) 
    return
    }
    else if(gamestop){
        bgm.pause()    
        stopgame()
        document.getElementById('pauseplay').style.visibility = 'revert';
        window.cancelAnimationFrame(reqframe)
        // if(confirm('game over. Retry ?')){
        //     window.location = '/'
        // }else{
        //     return
        // } 
    }
    
    else if(gamepause){
          document.getElementById('pauseplay').style.visibility = 'revert';
          stopgame()
    }
    else if(pipes.getBoundingClientRect().right < 0){
         
        // console.log('looping'); 
        toppipes[0].style.height = Math.floor(Math.random()*screen.height/2) + 'px'
        bottompipes[0].style.height = screen.height - gap[0].style.height - toppipes[0].getBoundingClientRect().bottom + 'px'
        hurdle[0].style.marginLeft = screen.width+'px'
    }
    else if(pipes2.getBoundingClientRect().right < 0){
        toppipes[1].style.height = Math.floor(Math.random()*screen.height/2) + 'px'
        // console.log('looping'); 
        bottompipes[1].style.height = screen.height - gap[1].getBoundingClientRect().bottom + 'px'
        hurdle[1].style.marginLeft = screen.width+'px'
    }

    hurdle[0].style.marginLeft = parseInt(pipes.style.marginLeft.replace('px','')) - 4 +'px'
    hurdle[1].style.marginLeft = parseInt(pipes2.style.marginLeft.replace('px','')) - 4 +'px'

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
    // console.log(timesincelastrender+': '+d);
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

function pauseplay(){
    gamepause = gamepause?false:true
    if(gamepause){
        gamestop = true
        console.log('pausing game');
    }else{
        console.log('resuming game');
        document.getElementById('pauseplay').style.visibility='hidden'
        // gamestate.bgmCurrentTime = bgm.currentTime
        bgm.play()
         v = parseInt(gamestate.birdvelocity)
         flaptime = (gamestate.flapping)?1:0
        // flap()
         bird.style.marginTop = gamestate.birdpositionMT
         pipes.style.marginLeft = gamestate.pipe1positionML
         pipes2.style.marginLeft = gamestate.pipe2positionML
         score  = gamestate.score 
         timesincelastrender = gamestate.timesincelastrender
         previousrendertime = undefined
        console.log(previousrendertime);
        gamestop = false

        setTimeout(window.requestAnimationFrame(main), 2000)
    }
    console.log('game paused:'+gamepause);
}

function checkgameover(){
 
    if(parseInt(birdstyle.marginTop.replace('px','')) > screen.height){ 
        sfx_fall.play()
        // gamestop = true
        gameover = true
        // document.getElementById('game').innerHTML = 'gameover' 
    } 
    
    collision() 
}

function collision(){ 
    // const hurdle = document.getElementsByClassName('hurdle')
    let birdrect = bird.getBoundingClientRect()

    let pipe1top = toppipes[0].getBoundingClientRect();
    let pipe2top = toppipes[1].getBoundingClientRect();
 
    let pipe1bottom = bottompipes[0].getBoundingClientRect();
    let pipe2bottom = bottompipes[1].getBoundingClientRect();
    
    console.log(birdrect.height, birdrect.width); 
        if(birdrect.top + birdrect.width/3 < pipe1top.bottom && 
            birdrect.right - birdrect.width/3 > pipe1top.left &&
            birdrect.left + birdrect.width/3 < pipe1top.right ){  
            sfx_gasp.play()
                 gameover = true
        }
        else if(birdrect.top + birdrect.width/3 < pipe2top.bottom && 
                birdrect.right - birdrect.width/3 > pipe2top.left &&
                birdrect.left + birdrect.width/3 < pipe2top.right ){  
            sfx_gasp.play()
                  gameover = true
        } 
        else if(birdrect.bottom - birdrect.width/3 > pipe1bottom.top && 
                birdrect.right - birdrect.width/3 > pipe1bottom.left &&
                birdrect.left + birdrect.width/3 < pipe1bottom.right ){  
            sfx_gasp.play()
                  gameover = true
        }
        else if(birdrect.bottom - birdrect.width/3 > pipe2bottom.top && 
                birdrect.right - birdrect.width/3 > pipe2bottom.left &&
                birdrect.left + birdrect.width/3 < pipe2bottom.right ){  
            sfx_gasp.play()
                  gameover = true 
        }   
updateScore()
}

function updateScore(){
    let birdrect = bird.getBoundingClientRect()

    let gap1 = gap[0].getBoundingClientRect()
    let gap2 = gap[1].getBoundingClientRect()

    if(birdrect.right - birdrect.width/3 < gap1.left && cleared === null){
        cleared = 0
    }
    else if(birdrect.right - birdrect.width/3 > gap1.left && cleared === 0){
        cleared = 1
    }
    else if(birdrect.left + birdrect.width/3 > gap1.right && cleared === 1){
        cleared = 2
    }

    if(birdrect.right - birdrect.width/3 < gap2.left && cleared === null){
        cleared = 10
    }
    else if(birdrect.right - birdrect.width/3 > gap2.left && cleared === 10){
        cleared =  11
    }
    else if(birdrect.left + birdrect.width/3 > gap2.right && cleared === 11){
        cleared = 12
    }

    else if(cleared === 2 || cleared === 12){
        console.log('in cleared');
        score++
        document.getElementById('score').innerHTML = 'Score: '+ score
        document.getElementById('finalscore').innerHTML = score
        cleared = null 
        sfx_coin.play()
    }
}

window.requestAnimationFrame(main)

window.addEventListener('mousedown',()=>{
    flapstart = new Date().getMilliseconds
    flap()
}) 

window.addEventListener('mouseup',()=>{
    // sfx_flap.play()
    flapend = new Date().getMilliseconds
    // f = 2
    // flapping = false
})

window.addEventListener('keydown',e=>{
    if(e.keyCode == 32){
        pauseplay()
    }
})