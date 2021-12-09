const stop = document.getElementById('stop') 
stop.addEventListener('click',stopgame)

const bird = document.getElementById('bird')

let gamestop = false
let iteration = 0;
let distance = 0;

function stopgame(){
    gamestop = true
}

const pipes = document.createElement('div')
pipes.classList.add('hurdle')

pipes.innerHTML = '<div id="toppipe"></div><div id="gap"></div><div id="bottompipe"></div>'

pipes.style.marginLeft = Math.floor(Math.random()*screen.width) + 'px'

document.getElementById('game').appendChild(pipes)
let birdstyle = bird.currentStyle || window.getComputedStyle(bird) 

const hurdle = document.getElementsByClassName('hurdle')[0]
let lastanimatedtime = 0
let timesincelastrender = 0

function main(timestamp){
    // console.log(timesincelastrender);
    timesincelastrender = timestamp - lastanimatedtime
    
    let framreq = window.requestAnimationFrame(main)

        if(gamestop == true){
            console.log('stopped'); 
            window.cancelAnimationFrame(framreq)
            return
        }
        else if(parseInt(pipes.style.marginLeft.replace('px','')) <= -50){
         
            console.log('looping'); 
            hurdle.style.marginLeft = screen.width+'px'
        }
    
    hurdle.style.marginLeft = parseInt(pipes.style.marginLeft.replace('px','')) - 2 +'px'
    
    // if(timesincelastrender < 50) 
    //     return
    // else{   
        // flap()
        gravity()
        checkgameover()
        lastanimatedtime = timestamp
    // }
    // document.getElementsByClassName('hurdle')[0].style.marginLeft.replace('px','')
}
 

function gravity(){
    // velocity = 10*velocity
    
     birdstyle = bird.currentStyle || window.getComputedStyle(bird);
    // let birdheight = parseInt(birdstyle.marginTop.replace('px',''))  
    bird.style.marginTop = distance +'px' 
    distance = Math.floor(0.01*10*iteration**2)
    iteration++
    // console.log(newheight);
    console.log(iteration);
}

function flap(){
    let birdheight = parseInt(birdstyle.marginTop.replace('px','')) 
    bird.style.marginTop = (birdheight - 80) + 'px'; 
    iteration = iteration - 20
    
    // bird.style.marginTop = (birdheight - 3) + 'px'; 
    // distance = (distance - 30)   
    // console.log(distance);
    // iteration=0
}


function checkgameover(){
    birdstyle = bird.currentStyle || window.getComputedStyle(bird);
    let birdheight = parseInt(birdstyle.marginTop.replace('px','')) 
    if( birdheight >= screen.height ){
        gamestop = true
    }
}
// parseInt(pipes.style.marginLeft.replace('px',''))

window.requestAnimationFrame(main)

