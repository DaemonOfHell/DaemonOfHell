let v = 0;
let g = 10;
let d = 0;
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
    timesincelastrender = timestamp - previousrendertime

    window.requestAnimationFrame(main)
    if(gamestop){
        return
    }

    gravity()
    checkgameover()

    previousrendertime = timestamp
}

function gravity(){
    d = v*timesincelastrender/1000
    // bird.style.marginTop = birdstyle.marginTop + 9 + 'px'
    v = v + g*timesincelastrender
    bird.style.marginTop = Math.floor(d) + 'px'
    console.log(timesincelastrender+' : ' +Math.floor(d));
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