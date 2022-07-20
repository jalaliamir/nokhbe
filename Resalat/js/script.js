$(function() {
    var canvas = $('#canvas');
    var context = canvas[0].getContext('2d');
    var numLineas = 4;
    var radius = 10;
    var anchoLinea = 10;
    var juegaPC = false;
    var puntacion = [0, 0]; //Guarda la puntación de los usaurios...
    var can = document.querySelector('canvas');
    can.style.position = 'absolute';
    can.style.top = "110px";
    can.style.left = "0";
    can.style.right = "0";
    can.style.margin = "0 auto";

    //Para guardar la posción de las líneas...
    var lineasJuego = [];
    var matrixDots = [];

    var limpiarCanvas = (function limpiarCanvas() {
        context.fillStyle = "#1F2354";
        context.fillRect(0, 0, 500, 500);
        return limpiarCanvas;
    })();

    /*
        número de completadas...
        estado, Indica si ya ha sido completada...
        quien la completó...
        Las líneas que la componen...
        Se guardará las posiciones del vector de lineasJuego
    */
    /*
    //Futura versión eventos touch...
    canvas.bind('touchmove',function(e){
      e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var elm = $(this).offset();
      var x = touch.pageX - elm.left;
      var y = touch.pageY - elm.top;
      if(x < $(this).width() && x > 0){
          if(y < $(this).height() && y > 0){
                  console.log(touch.pageY+' '+touch.pageX);
          }
      }
  });
  //touchmove touchstart touchend touchcancel
  */
    canvas.on("click mousemove mouseout", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!juegaPC) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            limpiarCanvas();
            if (e.type !== "mouseout") {
                encontrarLinea(x, y, e.type === "click" ? true : false);
            } else {
                dibujarLineas();
            }
            ubicarPuntos();
        }
    });

    //Buscar la línea en función de la posición del cursor sobre el canvas...
    var encontrarLinea = function(x, y, click) {
        var numLinea = -1;
        var rango = { xinicio: 0, xfinal: 0, yinicio: 0, yfinal: 0 };
        for (var i = 0; i < lineasJuego.length; i++) {
            rango.xinicio = lineasJuego[i].position.inicio.x;
            rango.xfinal = lineasJuego[i].position.final.x;
            rango.yinicio = lineasJuego[i].position.inicio.y;
            rango.yfinal = lineasJuego[i].position.final.y;
            if (lineasJuego[i].type === 1) {
                rango.yinicio -= anchoLinea + 2;
                rango.yfinal += anchoLinea + 2;
            }
            if (lineasJuego[i].type === 2) {
                rango.xinicio -= anchoLinea + 2;
                rango.xfinal += anchoLinea + 2;
            }
            if ((x >= rango.xinicio && x <= rango.xfinal) && (y >= rango.yinicio && y <= rango.yfinal)) {
                numLinea = i;
                break;
            }
        }
        if (numLinea >= 0) {
            if (!lineasJuego[numLinea].usado) {
                if (!click) {
                    context.beginPath();
                    context.moveTo(lineasJuego[numLinea].position.inicio.x, lineasJuego[numLinea].position.inicio.y);
                    context.lineTo(lineasJuego[numLinea].position.final.x, lineasJuego[numLinea].position.final.y);
                    //context.shadowBlur = 20;
                    //context.shadowColor = "black";
                    context.lineWidth = 15;
                    context.strokeStyle = "#A6A8AB";
                    context.stroke();
                } else {
                    //Se debe buscar en la Matriz a cual pertnece la línea...
                    lineasJuego[numLinea].jugador = 1;
                    lineasJuego[numLinea].usado = click;
                    pertneceMatrix(numLinea, 1);
                }
            }
        }
        dibujarLineas();
    };


    var pertneceMatrix = function(indice, jugador) {
        var encuentra = false;
        var completaCuadro = false;
        for (var i = 0; i < numLineas; i++) {
            for (var c = 0; c < numLineas; c++) {
                for (var d = 0; d < matrixDots[i][c].lineas.length; d++) {
                    if (matrixDots[i][c].lineas[d].indice === indice) {
                        matrixDots[i][c].lineas[d].estado = true;
                        matrixDots[i][c].lineas[d].jugador = jugador;
                        matrixDots[i][c].numLineas++;
                        if (matrixDots[i][c].numLineas === 4) {
                            matrixDots[i][c].terminado = true;
                            matrixDots[i][c].jugador = jugador;
                            //Para guardar las puntuaciones...
                            puntacion[jugador - 1]++;
                            completaCuadro = true;
                        }
                    }
                }
            }
        }
        if (completaCuadro) {
            //Para poner la puntuación...
            $("#puntua_" + jugador).html(puntacion[jugador - 1] <= 9 ? "0" + puntacion[jugador - 1] : puntacion[jugador - 1]);
        }
        if (numeroLineasDisponibles() > 0) {
            if (!completaCuadro) {
                juegaPC = jugador === 1 ? true : false;
                if (jugador === 1) {
                    jugadaPC();
                }
            } else {
                //Podría poner un temporizador para que no lo haga tan rápido...
                if (jugador === 2) {
                    jugadaPC();
                }
            }
        } else {
            if (puntacion[0] > 8) {
                win_you();
            }
            if (puntacion[1] > 8) {
                win_camp();
            }
            if (puntacion[0] == 8 && puntacion[1] == 8) {
                win_you();
            }
            // swal({
            //         title: puntacion[0] > puntacion[1] ? "YOU WIN :)" : "THE PC WINS",
            //         text: puntacion[0] > puntacion[1] ? "Congratulations you won" : "The computer has won",
            //         showCancelButton: false,
            //         confirmButtonColor: "#DD6B55",
            //         confirmButtonText: "Aceptar",
            //         closeOnConfirm: false,
            //         imageUrl: "img/" + (puntacion[0] > puntacion[1] ? "humano.png" : "robot.png")
            //     },
            //     function() {
            //         swal({ title: "Reload", text: "Reload", timer: 500, showConfirmButton: false });
            //         location.reload();
            //     });
        }
    };

    //Hace la jugada el PC...
    var jugadaPC = function() {
        var indiceJuega = -1;
        //Primero buscar si existe alguno donde haya tres lineas...
        for (var i = 0; i < numLineas; i++) {
            for (var c = 0; c < numLineas; c++) {
                if (matrixDots[i][c].numLineas === 3) {
                    //debugger;
                    for (var d = 0; d < matrixDots[i][c].lineas.length; d++) {
                        if (!matrixDots[i][c].lineas[d].estado) {
                            indiceJuega = matrixDots[i][c].lineas[d].indice;
                            break;
                        }
                    }
                    break;
                }
            }
            if (indiceJuega >= 0) {
                break;
            }
        }
        //No existe ninguna con tres líneas...
        if (indiceJuega < 0) {
            do {
                indiceJuega = Math.floor(Math.random() * lineasJuego.length);
                if (!lineasJuego[indiceJuega].usado) {
                    break;
                }
            } while (1);
        }
        limpiarCanvas();
        lineasJuego[indiceJuega].jugador = 2;
        lineasJuego[indiceJuega].usado = true;
        pertneceMatrix(indiceJuega, 2);
    };

    //Para saber el número de líneas disponibles...
    var numeroLineasDisponibles = function() {
        var disponibles = 0;
        for (var i = 0; i < lineasJuego.length; i++) {
            disponibles += !lineasJuego[i].usado ? 1 : 0;
        }
        return disponibles;
    };

    //Para dibujar las líneas que ya se han encontrado...
    var dibujarLineas = function() {
        //Buscar los que se han completado...
        var position = {
            x: 0,
            y: 0
        };
        for (var i = 0; i < numLineas; i++) {
            position.y = radius + 30 + (60 * i);
            for (var c = 0; c < numLineas; c++) {
                position.x = radius + 30 + (60 * c);
                if (matrixDots[i][c].terminado) {
                    context.fillStyle = matrixDots[i][c].jugador === 1 ? "#E4296D" : "#FFD432";
                    context.fillRect(position.x, position.y, 60, 60);
                }
            }
        }
        //Imprimir la líneas existentes...
        for (var i = 0; i < lineasJuego.length; i++) {
            if (lineasJuego[i].usado) {
                context.beginPath();
                context.moveTo(lineasJuego[i].position.inicio.x, lineasJuego[i].position.inicio.y);
                context.lineTo(lineasJuego[i].position.final.x, lineasJuego[i].position.final.y);
                //context.shadowBlur = 20;
                //context.shadowColor = "black";
                context.lineWidth = 15;
                context.strokeStyle = lineasJuego[i].jugador === 1 ? "#A6A8AB" : "#A6A8AB";
                context.stroke();
            }
        }

    };

    var ubicarLineas = function() {
        var position = {
            x: 0,
            y: 0
        };
        var datoLinea = {};
        for (var i = 0; i <= numLineas; i++) {
            if (i < numLineas) {
                matrixDots[i] = [];
            }
            position.y = radius + 30 + (60 * i);
            for (var c = 0; c <= numLineas; c++) {
                if (i < numLineas && c < numLineas) {
                    matrixDots[i][c] = {
                        numLineas: 0,
                        terminado: false,
                        jugador: 0,
                        lineas: []
                    };
                }
                position.x = radius + 30 + (60 * c);
                //Para la línea horizontal...
                if (c < numLineas) {
                    lineasJuego.push({
                        type: 1,
                        jugador: 0,
                        usado: false,
                        position: {
                            inicio: {
                                x: position.x,
                                y: position.y
                            },
                            final: {
                                x: position.x + 60,
                                y: position.y

                            }
                        }
                    });
                    datoLinea = {
                        indice: lineasJuego.length - 1,
                        estado: false,
                        jugador: 0
                    };
                    if (i < numLineas) {
                        matrixDots[i][c].lineas.push(datoLinea);
                    }
                    if (i > 0) {
                        matrixDots[i - 1][c].lineas.push(datoLinea);
                    }
                }
                //Para la línea vertical...
                if (i < numLineas) {
                    lineasJuego.push({
                        type: 2,
                        jugador: 0,
                        usado: false,
                        position: {
                            inicio: {
                                x: position.x,
                                y: position.y
                            },
                            final: {
                                x: position.x,
                                y: position.y + 60

                            }
                        }
                    });
                    datoLinea = {
                        indice: lineasJuego.length - 1,
                        estado: false,
                        jugador: 0
                    };
                    if (c < numLineas) {
                        matrixDots[i][c].lineas.push(datoLinea);
                    }
                    if (c > 0) {
                        matrixDots[i][c - 1].lineas.push(datoLinea);
                    }
                }
            }
        }
    }();

    var ubicarPuntos = (function ubicarPuntos() {
        var position = {
            x: 0,
            y: 0
        };
        for (var i = 0; i <= numLineas; i++) {
            position.y = radius + 30 + (60 * i);
            for (var c = 0; c <= numLineas; c++) {
                position.x = radius + 30 + (60 * c);
                //Para dibujar el círculo...
                context.beginPath();
                context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
                /*context.shadowBlur = 20;
                context.shadowOffsetX = 3;
                context.shadowOffsetY = 3;*/
                context.lineWidth = 1;
                context.shadowColor = "black";
                context.fillStyle = '#fff';
                context.strokeStyle = '#fff';
                context.fill();
                context.stroke();
            }
        }
        return ubicarPuntos;
    })();
});