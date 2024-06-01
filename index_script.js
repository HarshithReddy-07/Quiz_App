document.getElementById('Quiz-info').addEventListener('submit', function(event) {
    event.preventDefault();
    const topic = document.getElementById('topic').value;
    const difficulty = document.getElementById('difficulty').value;
    localStorage.setItem('quiz-topic', topic);
    localStorage.setItem('quiz-level-difficulty', difficulty);
    window.location.href = 'quiz.html';
});
document.addEventListener('DOMContentLoaded', () => {
    const myModal = new bootstrap.Modal(document.getElementById('welcomeModal'), {
        backdrop: 'static',
        keyboard: false
    });
    myModal.show();
});

window.addEventListener('load', () => {

    const canvas = document.querySelector("canvas");
    var c= canvas.getContext("2d");

    const resize = () => {
        canvas.style.top=0;
        canvas.style.left=0;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawCircles()
    }
    function drawCircles(){
        for(var i=0; i<69 ;i++){
            c.beginPath()
            c.strokeStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.5)`;
            c.arc(Math.random()*window.innerWidth, Math.random()*window.innerHeight,Math.random()*70,0,360);
            c.stroke()
        }
    } 
    function animate() {
        drawCircles();
        // requestAnimationFrame(animate);
    }
    resize();
    animate();
    window.addEventListener('resize', resize);
    // window.addEventListener('', resize);
});