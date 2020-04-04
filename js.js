document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#pause').onclick = pause_game;

    document.getElementById("start").onclick = start_game;

    document.addEventListener ('keydown', function (e) {
        if (e.keyCode == 32) {
            jump = true;
        }
    });
////////////////////////////////////////////////////////////////////////////////
    let context = document.getElementById("canvas1").getContext("2d");
    var next;
    var paused = true;
    var jump = false;
    var jump_counter_max = 50;
    var jump_counter = jump_counter_max;
    var jump_height = 10;
    var rectangle = {
        xo: 0,
        yo: 208, // Center of the canvas
        height:32,
        width:32,
        x: null,
        y: null,
    };
////////////////////////////////////////////////////////////////////////////////
    function start_game () {
        rectangle.x = rectangle.xo;
        rectangle.y = rectangle.yo;
        if (paused) {
            paused = false;
            window.requestAnimationFrame(loop);
        }
    }
    function pause_game () {
        paused = !paused;
        window.requestAnimationFrame(loop);
    }
////////////////////////////////////////////////////////////////////////////////
    function loop () {
        rectangle.x ++;
        context.fillStyle = "#00ffff"; //sky
        context.fillRect (0, 0, 800, 400); //sky
        context.fillStyle = "#ff9900"; //ground
        context.fillRect (0, 400, 800, 480); //ground
        context.fillStyle = "#ff0000";
        context.beginPath();
        context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        context.fill();
        if (rectangle.x > 800) {// if rectangle goes past right boundary
            rectangle.x = -32;
        };
        ////////////////////////////////////////////////////////////////////////
        if (jump) {
            if (jump_counter === jump_counter_max) {
                rectangle.y -= jump_height;
            }
            jump_counter--;
            if (jump_counter === 0) {
                jump = false;
                jump_counter = jump_counter_max;
                rectangle.y += jump_height;
            }
        }
        ////////////////////////////////////////////////////////////////////////
        if (!paused) {
            window.requestAnimationFrame(loop);
        }
    }

});
