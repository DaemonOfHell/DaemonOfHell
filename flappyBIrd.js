let v = 0;
let g = 30;
let d = 0;
let f = 197;  // force of 1 flap in newton
let m = .5;  // mass of bird in kg

// let flapstart = 0
// let flapend = 0

// let flaptime = flapend - flapstart
// let flapping = false

console.log(bird);
let gamestop = false
let birdstyle = bird.currentStyle || window.getComputedStyle(bird);
  
// let startrendertime = 0
let previousrendertime
let timesincelastrender = 0

function main(timestamp){
    if( previousrendertime === undefined){
        previousrendertime = timestamp
    }
    timesincelastrender = (timestamp - previousrendertime)/1000

    let reqframe = window.requestAnimationFrame(main)

    if(gamestop){
        window.cancelAnimationFrame(reqframe)
        return
    }

    // if(flaptime > 0){
    //     v = gravity() + flap()  
    // }
    // else{
        v = gravity()
    // } 
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
    // console.log('flap: ',(f*timesincelastrender)/m+v);
    // bird.style.backgroundImage = "url('./res/birdflap.gif')"
    // bird.style.transform = "rotate(335deg)";
    v =  -(f*timesincelastrender)/m  
return v
}

function stopgame(){
    gamestop = true
}

function checkgameover(){
    if(parseInt(birdstyle.marginTop.replace('px','')) > screen.height){
        gamestop = true
        document.getElementById('game').innerHTML = 'gameover'
    } 
}


window.requestAnimationFrame(main)

window.addEventListener('mousedown',()=>{
    // flapstart = new Date().getMilliseconds
    // flapping = true
})

window.addEventListener('dblclick',()=>{
    f = 380
    // flapstart = new Date().getMilliseconds
    // flapping = true
})

window.addEventListener('mouseup',()=>{
    // flapend = new Date().getMilliseconds
    f = 197
    // flapping = false
})