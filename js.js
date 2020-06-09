document.addEventListener('DOMContentLoaded', function() {

////////////////////////////////////////////////////////////////////////////////

let orientation = window.matchMedia("(orientation:landscape)");
let is_portrait = !orientation.matches;
/*
    if (orientation.matches) {
        //document.querySelector('.computer').style.display = 'block';
        //document.querySelector('.mobile').style.display = 'none';
    } else {
        //document.querySelector('.computer').style.display = 'none';
        //document.querySelector('.mobile').style.display = 'block';
    };
*/
//VARIABLES/////////////////////////////////////////////////////////////////////

    const context = document.getElementById("canvas1").getContext("2d");

    const canvas_width = 720;
    const canvas_height = 480;
    const ground_height = 80;
    const sky_height = canvas_height - ground_height;

    const short_person_width = 48;
    const short_person_height = 48;
    const tall_person_width = 48;
    const tall_person_height = 96;
    const person_x0 = 240;
    let person_x1, person_y0, person_y1;
    let person_width, person_height;
    let person_speed, person_v0, person_a;
    let person_area;

    const enemy_width = 48;
    const enemy_height = 48;
    class Enemy {
        constructor (x, y, number, enemy1) {
            this.x = x;
            this.y = y
            this.n = number;
            this.a = enemy1;
        }
    }
    let new_enemy;
    let enemy_var1;
    let enemy_number;
    let enemy_animation;
    let enemy_y;
    let enemies = [];
    let enemy_to_delete = [];
    let enemies_area = [];
    let enemy_x0, enemy_x1, enemy_y0, enemy_y1;

    let jump_array;
    let jump_difference = 0;
    let jump_step = 0;
    let jump_end = false;
    const nogravity_steps = 30;

    let counter = 0;
    let animation_counter = 0;
    let person_animation;
    let person_animation_interval = 7;
    let points = 0;

    let next;
    const t_int = 0.02;
    let t0;
    let t1;
    let paused = true;
    let jump = false;
    let jump_counter_max = 50;
    let jump_counter = jump_counter_max;
    let jump_height = 10;

    let step = 1; //1: select person, 2: game, 3: game over
    let selecting_person = 1; //1: alvaro, 2: david, 3: luis, 4: pablo
    let show_selecting = true;
    let person1, person2, person3, person4;

    const gameover_overlap = 5;

//SPRITE VARIABLES//////////////////////////////////////////////////////////////
    const alvaro1 = document.getElementById('alvaro1');
    const alvaro2 = document.getElementById('alvaro2');
    const alvaro3 = document.getElementById('alvaro3');
    const alvaro4 = document.getElementById('alvaro4');
    const david1 = document.getElementById('david1');
    const david2 = document.getElementById('david2');
    const david3 = document.getElementById('david3');
    const david4 = document.getElementById('david4');
    const luis1 = document.getElementById('luis1');
    const luis2 = document.getElementById('luis2');
    const luis3 = document.getElementById('luis3');
    const luis4 = document.getElementById('luis4');
    const pablo1 = document.getElementById('pablo1');
    const pablo2 = document.getElementById('pablo2');
    const pablo3 = document.getElementById('pablo3');
    const pablo4 = document.getElementById('pablo4');

    const info_alvaro = new Image ();
    info_alvaro.src = "sprites/info_alvaro.png";
    const info_david = new Image ();
    info_david.src = "sprites/info_david.png";
    const info_luis = new Image ();
    info_luis.src = "sprites/info_luis.png";
    const info_pablo = new Image ();
    info_pablo.src = "sprites/info_pablo.png";

    const small_box = new Image ();
    small_box.src = "sprites/small_box.png";
    const big_box = new Image ();
    big_box.src = "sprites/big_box.png";

    const enemy1 = new Image ();
    enemy1.src = "sprites/enemy1.png";
    const enemy2 = new Image ();
    enemy2.src = "sprites/enemy2.png";

    const gameover = new Image ();
    gameover.src = 'sprites/gameover.png';

//EVENT LISTENERS///////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //JUMP
        if (e.keyCode == 87 || e.keyCode == 38) { //w key = 87, arrow up key = 38
            if (step == 2) {
                jump = true;
            }
        }
    });
    document.querySelector('#jump').onclick = function () {
        if (step == 2) {
            jump = true;
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //PAUSE
        if (e.keyCode == 80) { //p key = 80
            if (step == 2) {
                pause_game ();
            }
        }
    });
    document.querySelector('#pause').onclick = function () {
        if (step == 2) {
            pause_game ();
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //RESET
        if (e.keyCode == 82) { //r key = 82
            if (step == 2 || step == 3) {
                reset_game ();
            }
        }
    });
    document.querySelector('#reset').onclick = function () {
        if (step == 2 || step == 3) {
            reset_game ();
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //SELECT PERSON UP
        if (e.keyCode == 38) { //arrow up
            if (step == 1) {
                if (selecting_person > 1) {
                    selecting_person--;
                    select_person_loop ();
                }
            }
        }
    });
    document.querySelector('#arrow_up').onclick = function () {
        if (step == 1) {
            if (selecting_person > 1) {
                selecting_person--;
                select_person_loop ();
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //SELECT PERSON DOWN
        if (e.keyCode == 40) { //arrow down
            if (step == 1) {
                if (selecting_person < 4) {
                    selecting_person++;
                    select_person_loop ();
                }
            }
        }
    });
    document.querySelector('#arrow_down').onclick = function () {
        if (step == 1) {
            if (selecting_person < 4) {
                selecting_person++;
                select_person_loop ();
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    document.addEventListener ('keydown', function (e) { //SELECT PERSON ENTER
        if (e.keyCode == 13) { //enter
            if (step == 1) {
                step = 2;
                switch (selecting_person) {
                    case 1:
                        person1 = alvaro1;
                        person2 = alvaro2;
                        person3 = alvaro3;
                        person4 = alvaro4;
                        person_width = short_person_width;
                        person_height = short_person_height;
                        person_speed = 5;
                        person_v0 = -300;
                        person_a = 150;
                        break;
                    case 2:
                        person1 = david1;
                        person2 = david2;
                        person3 = david3;
                        person4 = david4;
                        person_width = tall_person_width;
                        person_height = tall_person_height;
                        person_speed = 7;
                        person_v0 = -650;
                        person_a = 400;
                        break;
                    case 3:
                        person1 = luis1;
                        person2 = luis2;
                        person3 = luis3;
                        person4 = luis4;
                        person_width = short_person_width;
                        person_height = short_person_height;
                        person_speed = 5;
                        person_v0 = -300;
                        person_a = 150;
                        break;
                    case 4:
                        person1 = pablo1;
                        person2 = pablo2;
                        person3 = pablo3;
                        person4 = pablo4;
                        person_width = short_person_width;
                        person_height = short_person_height;
                        person_speed = 5;
                        person_v0 = -650;
                        person_a = 400;
                        break;
                }
                person_x1 = person_x0 + person_width - 1;
                person_y0 = sky_height - person_height;
                person_y1 = sky_height + jump_difference - 1;
                jump_array = createJumpArray (person_y0, person_v0, person_a, t_int);
                start_game ();
            }
        }
    });
    document.querySelector('#enter').onclick = function () {
        if (step == 1) {
            step = 2;
            switch (selecting_person) {
                case 1:
                    person1 = alvaro1;
                    person2 = alvaro2;
                    person3 = alvaro3;
                    person4 = alvaro4;
                    person_width = short_person_width;
                    person_height = short_person_height;
                    person_speed = 5;
                    person_v0 = -300;
                    person_a = 150;
                    break;
                case 2:
                    person1 = david1;
                    person2 = david2;
                    person3 = david3;
                    person4 = david4;
                    person_width = tall_person_width;
                    person_height = tall_person_height;
                    person_speed = 7;
                    person_v0 = -650;
                    person_a = 400;
                    break;
                case 3:
                    person1 = luis1;
                    person2 = luis2;
                    person3 = luis3;
                    person4 = luis4;
                    person_width = short_person_width;
                    person_height = short_person_height;
                    person_speed = 5;
                    person_v0 = -300;
                    person_a = 150;
                    break;
                case 4:
                    person1 = pablo1;
                    person2 = pablo2;
                    person3 = pablo3;
                    person4 = pablo4;
                    person_width = short_person_width;
                    person_height = short_person_height;
                    person_speed = 5;
                    person_v0 = -650;
                    person_a = 400;
                    break;
            }
            person_x1 = person_x0 + person_width - 1;
            person_y0 = sky_height - person_height;
            person_y1 = sky_height + jump_difference - 1;
            jump_array = createJumpArray (person_y0, person_v0, person_a, t_int);
            start_game ();
        }
    };

//BUTTONS////////////////////////////////////////////////////
    function check_buttons () {
        if (is_portrait && step == 1) {
            document.querySelector('#selecting_buttons').style.display = 'block';
            document.querySelector('#playing_buttons').style.display = 'none';
        };
        if (is_portrait && step >= 2) {
            document.querySelector('#selecting_buttons').style.display = 'none';
            document.querySelector('#playing_buttons').style.display = 'block';
        };
        if (!is_portrait) {
            document.querySelector('#selecting_buttons').style.display = 'none';
            document.querySelector('#playing_buttons').style.display = 'none';
        };
    }

//STEP 1: SELECT PERSON LOOP////////////////////////////////////////////////////
    function select_person_loop () {
        if (step == 1) {
            context.fillStyle = "#99d9ea" ; //light turquoise in paint
            context.fillRect (0, 0, canvas_width, canvas_height); //sky
            //context.beginPath();
            context.drawImage (alvaro1, 150, 40+10, short_person_width, short_person_height);
            context.drawImage (david1, 150, 40+61+40, tall_person_width, tall_person_height);
            context.drawImage (luis1, 150, 40+61+40+96+40+10, short_person_width, short_person_height);
            context.drawImage (pablo1, 150, 40+61+40+96+40+61+40+10, short_person_width, short_person_height);
            context.drawImage (info_alvaro, 300, 40);
            context.drawImage (info_david, 300, 40+61+40+17);
            context.drawImage (info_luis, 300, 40+61+40+96+40);
            context.drawImage (info_pablo, 300, 40+61+40+96+40+61+40);
            if (true) {
                switch (selecting_person) {
                    case 1:
                        context.drawImage (small_box, 150-6, 40-6);
                        break;
                    case 2:
                        context.drawImage (big_box, 150-6, 40+61+40-6);
                        break;
                    case 3:
                        context.drawImage (small_box, 150-6, 40+61+40+96+40-6);
                        break;
                    case 4:
                        context.drawImage (small_box, 150-6, 40+61+40+96+40+61+40-6);
                        break;
                }
            }
            big_box.onload = function () {
                select_person_loop ();
            }
        }
    }

// STEP 1: CREATE JUMP FUNCTION/////////////////////////////////////////////////
function createJumpArray (person_y0, person_v0, person_a, t_int) {
    let t, y, v;
    let t_array = [0];
    let y_array = [person_y0];
    let y_array2 = [person_y0];
    let v_array = [person_v0];
    y = person_y0;
    while (y <= person_y0) {
        t = last (t_array) + t_int;
        v = last (v_array) + person_a * t_int;
        y = last (y_array) + v * t_int + 0.5*person_a*t_int*t_int;
        t_array.push(t);
        v_array.push(v);
        y_array.push(y);
        y_array2.push (Math.floor (y));
    }
    y_array2.pop();
    y_array2.push(person_y0);

    if (selecting_person == 1) {//person == alvaro
        y_array3 = [];
        for (var i = 0; i<y_array2.length; i++) {
            y_array3.push (y_array2 [i]);
            if (y_array2 [i] == Math.min (...y_array2)) { //spread operator, Math.min doesn't know how to handle arrays
                for (var j = 0; j<nogravity_steps; j++) {
                    y_array3.push (y_array2 [i]);
                }
            }
        }
        //console.log (`jump array: ${y_array3}`);
        return y_array3;
    }
    //console.log (`jump array: ${y_array2}`);
    return y_array2;
}

function last (array) {
    let lastElement;
    lastElement = array[array.length-1];
    return lastElement;
}

//STEP 2: OPTIONS///////////////////////////////////////////////////////////////
    function start_game () {
        check_buttons ();
        if (step == 2) {
            if (paused) {
                paused = false;
                window.requestAnimationFrame(loop);
            }
            t0 = new Date().getTime();
        }
    }
    function pause_game () {
        check_buttons ();
        paused = !paused;
        window.requestAnimationFrame(loop);
    }
    function reset_game () {
        check_buttons ();
        location.reload()
    }

//STEP 2: GAME LOOP/////////////////////////////////////////////////////////////
    function loop () {
        points++;
        counter++;
        animation_counter++;
        document.querySelector('#points').innerHTML = Math.floor(points/10);

        if (animation_counter <= 1 * person_animation_interval ) {
            person_animation = person1;
        } else if (animation_counter <= 2 * person_animation_interval) {
            person_animation = person2;
        } else if (animation_counter <= 3 * person_animation_interval) {
            person_animation = person3;
        } else if (animation_counter <= 4 * person_animation_interval - 1) {
            person_animation = person4;
        } else { // counter == 4 * person_animation_interval
            person_animation = person4;
            animation_counter = 0;
        }
        if ( counter % (3*enemy_width) == 0) {

            if (Math.random() < 0.5) {
                enemy_var1 = Math.floor (Math.random() * 8);
                enemy_var2 = Math.floor (Math.random() * 8);
                enemy_y = (enemy_var2 * 50)
                switch (enemy_var1) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        enemy_number = 1;
                        enemy_animation = enemy1;
                        break;
                    case 4:
                    case 5:
                        enemy_number = 2;
                        enemy_animation = enemy2;
                        break;
                    case 6:
                    case 7:
                        enemy_number = 3;
                        enemy_animation = enemy2;
                        break;
                }
                new_enemy = new Enemy (canvas_width, enemy_y, enemy_number, enemy_animation);
                enemies.push (new_enemy);
            }
        }


        //JUMP DIFFERENCE
        if (jump) {
            points += 10;
            jump_step++;
            jump_difference = jump_array [jump_step] - jump_array [0];
            if (jump_step == jump_array.length) {
                jump = false;
                jump_step = 0;
                jump_difference = 0;
            }
        }
        person_y0 = sky_height - person_height + jump_difference;
        person_y1 = person_y0 + person_height - 1;

        ////////////////////////////////////////////////////////////////////////
        context.fillStyle = "#00ffff"; //sky
        context.fillRect (0, 0, canvas_width, sky_height); //sky
        context.fillStyle = "#ff9900"; //ground
        context.fillRect (0, sky_height, canvas_width, sky_height + ground_height); //ground
        context.fillStyle = "#ff0000";
        context.beginPath();
        //context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        context.fill();
        context.drawImage (person_animation, person_x0, person_y0, person_width, person_height);
        ////////////////////////////////////////////////////////////////////////
        for (var i=0; i<enemies.length; i++) {
            enemies[i].x--;
            if (animation_counter % (2 * person_animation_interval) == 0 ) {
                if (enemies[i].a == enemy1) {
                    enemies[i].a = enemy2;
                } else {
                    enemies[i].a = enemy1;
                }
            }
            for (var j=0; j<enemies[i].n; j++) {
                context.drawImage ( enemies[i].a, enemies[i].x, enemies[i].y - (enemy_height * j) );
            }

            if (enemies[i].x < 0-enemy_width) {
                enemy_to_delete.push (i)
            }
        }
        for (var i=0; i<enemy_to_delete.length; i++) {
            enemies.shift();
        }
        enemy_to_delete = [];
        for (var i=0; i<enemies.length; i++) {
            enemy_x0 = enemies[i].x;
            enemy_x1 = enemy_x0 + enemy_width -1;
            enemy_y0 = enemies[i].y - (enemies[i].n - 1) * enemy_height;
            enemy_y1 = enemies[i].y + enemy_height - 1;
            if (enemy_x0 <= person_x1 - gameover_overlap - 5 && enemy_x1 >= person_x0 + gameover_overlap + 5) {
                if (enemy_y0 <= person_y1 - gameover_overlap && enemy_y1 >= person_y0 + gameover_overlap) {
                    step = 3;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////
        if (!paused && step == 2) {
            //window.requestAnimationFrame(loop); //60Hz -> speed = 60 px/s, 800 px / 60 px/s = 13.33 s
            setTimeout (loop, person_speed);
        }
        if (step == 3) {
            context.drawImage (gameover, 0, 0);
        }
    }

////////////////////////////////////////////////////////////////////////////////
    check_buttons ();
    select_person_loop ();
    new_enemy = new Enemy (canvas_width, 150, 1, enemy1);
    enemies.push (new_enemy);
});
