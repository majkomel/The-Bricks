function drawIt() {
    var x = 150;
    var y = 150;
    var dx = 1;
    var dy = 3;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;

    //tipke za premikanje ploščice
    var rightDown = false;
    var leftDown = false;

    //opeke
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    //timer
    var sekunde;
    var sekundeI;
    var minuteI;
    var intTimer;
    var izpisTimer;
    var start = false;
	var konecigre=false;
	
	kace = new Array();



    function init() {
        tocke = 0;
        $("#tocke").html(tocke);
        sekunde = 0;
        izpisTimer = "00:00";
        intTimer = setInterval(timer, 1000);
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        return setInterval(draw, 10);
    }

    //timer
    function timer() {
		if(konecigre==false){
	        if (start == true) {
	            sekunde++;

	            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
	            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
	            izpisTimer = minuteI + ":" + sekundeI;

	            $("#cas").html(izpisTimer);
	        }
		}
        else {
            
            //izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }

    }

    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.keyCode == 37)
            leftDown = true;
        else if (evt.keyCode == 39) 
			rightDown = true;
		else if (evt.keyCode == 13) { // Tipka ENTER
			start = !start; 
		}
		else if(evt.keyCode==82){
			location.reload();
		}
		
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 37)
            leftDown = false;
        else if (evt.keyCode == 39) rightDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 85;
    }

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 5;
        NCOLS = 8;
        BRICKWIDTH = 70;
        BRICKHEIGHT = 20;
        PADDING = 3;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }


    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }
	function kaca(x, y, w, h){
		ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
	}

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    //END LIBRARY CODE
    function draw() {
        clear();
        circle(x, y, 10);//riši krog
		rect(paddlex, HEIGHT - paddleh -20, paddlew, paddleh);//riši plošček
		//riši opeke
		for (i = 0; i < NROWS; i++) {
				for (j = 0; j < NCOLS; j++) {
					if (bricks[i][j] == 1) {
						rect((j * (BRICKWIDTH + PADDING)) + PADDING,
							(i * (BRICKHEIGHT + PADDING)) + PADDING,
							BRICKWIDTH, BRICKHEIGHT);
					}
				}
			}
		// Risanje in premikanje padajočih kač
		for (var i = 0; i < kace.length; i++) {
			var k = kace[i];
			
			// Nariši kačo na trenutnih koordinatah
			kaca(k.x, k.y, 8, 40);
			
			// Če je igra zagnana, povečuj Y (padanje)
			if (start) {
				k.y += 2; // Hitrost padanja
			}

			// Preveri, če je ploščica ulovila kačo (kolizija s ploščico)
			if (k.y + 40 > HEIGHT - paddleh - 20 && k.x > paddlex && k.x < paddlex + paddlew) {
				start = false;
				konecigre=true;
				clearInterval(intTimer);
					Swal.fire({
				title: 'Konec igre!',
				text: 'Stevilo tock:' + tocke,
				icon: 'error',
				confirmButtonText: 'Igraj ponovno',
				confirmButtonColor: '#3085d6',
				allowOutsideClick: false
				
				}).then(function(result) {
					// Ta del se izvede po kliku na gumb
					if (result.isConfirmed) {
						location.reload(); // Ponovno naloži stran
					}
				});
				kace.splice(i, 1);//izbrise kaco s tabele
				return;//ustavi draw

			}
			else if (k.y > HEIGHT) {
			kace.splice(i, 1);
			i--; // Zmanjšamo i, ker se je tabela skrajšala
    }
		}
        //premik ploščice levo in desno
		if(konecigre==false){
			if (start) {
				if (rightDown) {
					if ((paddlex + paddlew) < WIDTH) {
						paddlex += 6;
					} else {
						paddlex = WIDTH - paddlew;
					}
				}
				else if (leftDown) {
					if (paddlex > 0) {
						paddlex -= 5;
					} else {
						paddlex = 0;
					}
				}
				rowheight = BRICKHEIGHT + PADDING + r / 2; //Smo zadeli opeko?
				colwidth = BRICKWIDTH + PADDING + r / 2;
				row = Math.floor((y-r) / rowheight);
				col = Math.floor((x-r) / colwidth);
				if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
					// razdalja žogce do vodoravnih in navpičnih robov opeke
					var distX = Math.abs(x - (col * colwidth + BRICKWIDTH / 2));
					var distY = Math.abs(y - (row * rowheight + BRICKHEIGHT / 2));

					if (distX / BRICKWIDTH > distY / BRICKHEIGHT)
						dx = -dx; // zadetek z leve ali desne strani
					else
						dy = -dy; // zadetek z zgornje ali spodnje strani

					bricks[row][col] = 0;
					tocke += 1;
					if(tocke==40){
						start=false;
						Swal.fire({
						title: 'Čestitamo! Zmaga!',
						text: 'Uničili ste vse opeke! Vaš čas: ' + izpisTimer,
						text: 'Stevilo tock:' + tocke,
						icon: 'success',
						confirmButtonText: 'Igraj ponovno',
						confirmButtonColor: '#28a745',
						allowOutsideClick: false
					}).then(function(result) {
						if (result.isConfirmed) {
							location.reload();
						}
					});
					return;
					}
					$("#tocke").html(tocke);
					var opekaX = col * (BRICKWIDTH + PADDING) + PADDING;
					var opekaY = row * (BRICKHEIGHT + PADDING) + PADDING;
					var ran = Math.floor(Math.random() * 5) + 1;
					if(ran==2){
						kace.push({
						
							x: opekaX + BRICKWIDTH / 2, // Sredina opeke
							y: opekaY,
							sirina: 6,
							visina: 40,
						
						});
					}
				}

				//odboj od leve in desne stene
				if (x + dx > WIDTH - r || x + dx < 0 + r)
					dx = -dx;//ce bi zogca zadela steno ji obrni x smer

				// 1. Odboj od zgornje stene
				if (y + dy < 0 + r) {
					dy = -dy;
				} 
				// 2. Preverjanje odboja od ploščice (višina ploščice je HEIGHT - paddleh - 20)
				else if (y + dy > HEIGHT - paddleh - 20 - r) {
					// Preveri, če je žogica poravnana s ploščico po X osi
					if (x > paddlex && x < paddlex + paddlew) {
						// Izračun kota odboja glede na to, kje zadane ploščico
						dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
						dy = -dy;
						// Popravek pozicije, da se žogica ne "zagozdi" v ploščici
						y = HEIGHT - paddleh - 20 - r; 
					} 
					// 3. Če zgreši ploščico in zadane dejansko dno
					else if (y + dy > HEIGHT - r) {
						start = false;
						konecigre=true;
						clearInterval(intTimer); 
					}
				}
				x += dx;
				y += dy;
				if(konecigre){
					Swal.fire({
				title: 'Konec igre!',
				text: 'Stevilo tock:' + tocke,
				icon: 'error',
				confirmButtonText: 'Igraj ponovno',
				confirmButtonColor: '#3085d6',
				allowOutsideClick: false
				
				}).then(function(result) {
					// Ta del se izvede po kliku na gumb
					if (result.isConfirmed) {
						location.reload(); // Ponovno naloži stran
					}
				});
				return;
				}
			}
		}
    }

    init();
    init_paddle();
    initbricks();


}





