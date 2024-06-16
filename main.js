document.getElementById("btnJugar").addEventListener("click", jugar);
document.addEventListener("keydown", capturoDireccion);

e = document.getElementById("escenario");
let escenario;
let vibora = [];
let enPartida = false;
let direccion; //IZ, DE, AR, AB

function jugar() {
  let btnJugar = document.getElementById("btnJugar");
  e.removeChild(btnJugar);
  iniciarPartida();
}

function iniciarPartida() {
  inicializarEscenario();
  inicializarViborita();
  enPartida = true;
  gameLoop();
}

//Función con loop infinito hasta que termine la partida.
//Se espera 250ms entre cada vuelta para verificar el estado de la partida,
//actualizar la posición de la viborita y volver a dibujarla.
async function gameLoop() {
  let continuo = true;
  while (enPartida) {
    await pasaElTiempo(250);
    continuo = muevoViborita();
    if (!continuo) gameOver();
  }
}

//En esta función implementamos promesas en conjunto con setTiemout para simular asincronía,
//y tener una forma de "esperar que pase el tiempo".
function pasaElTiempo(tiempo) {
  return new Promise((resolve) => setTimeout(resolve, tiempo));
}
function inicializarEscenario() {
  escenario = Array(10)
    .fill()
    .map(() => Array(10).fill());

  for (let x = 0; x < 10; x++) {
    for (let i = 0; i < 10; i++) {
      let unidad = document.createElement("div");
      unidad.setAttribute("id", `u${x}${i}`);
      unidad.classList.add("clsUnidad");
      escenario[x][i] = unidad;
      e.appendChild(unidad);
    }
  }

  escenario[1][1].classList.add("clsAzucar");
  escenario[1][1].classList.remove("clsUnidad");
}

function inicializarViborita() {
  let cabezaVibora = escenario[4][5];
  cabezaVibora.classList.remove("clsUnidad");
  cabezaVibora.classList.add("clsCabezaVibora");
  vibora = [cabezaVibora];

  let cuerpoVibora = escenario[4][4];
  cuerpoVibora.classList.remove("clsUnidad");
  cuerpoVibora.classList.add("clsVibora");
  vibora.push(cuerpoVibora);
  direccion = "DE";
}

//Esta función se dispara cuando ocurre el evento keydown. Se encarga de registrar
//la dirección hacia donde se movera la viborita y las nuevas coordenadas de la cabeza.
function capturoDireccion(e) {
  if (!enPartida) return;

  switch (e.keyCode) {
    case 37: //Izquierda
      asignoDireccion("IZ", muevoIzquierda());
      break;
    case 38: //Arriba
      asignoDireccion("AR", muevoArriba());
      break;
    case 39: //Derecha
      asignoDireccion("DE", muevoDerecha());
      break;
    case 40: //Abajo
      asignoDireccion("AB", muevoAbajo());
      break;
  }
}

function asignoDireccion(d, coord) {
  if (vibora[1] != escenario[coord[0]][coord[1]]) direccion = d;
}

//Este método se encarga de actualizar las coordenadas de la viborita y
//verificar si chocamos con el cuerpo o nos salimos del escenario, en cuyo caso
//mostramos el mensaje de Game Over y detenemos la partida.
function muevoViborita() {
  if (!enPartida) return false;

  let coordenadas;
  switch (direccion) {
    case "IZ": //Izquierda
      coordenadas = muevoIzquierda();
      break;
    case "AR": //Arriba
      coordenadas = muevoArriba();
      break;
    case "DE": //Derecha
      coordenadas = muevoDerecha();
      break;
    case "AB": //Abajo
      coordenadas = muevoAbajo();
      break;
    default:
      return;
  }

  if (saliDelEscenario(coordenadas) || choque(coordenadas)) {
    return false;
  }

  let nuevaCabeza = escenario[coordenadas[0]][coordenadas[1]];
  muevoCuerpo(nuevaCabeza);
  return true;
}

function muevoDerecha() {
  let idCabeza = vibora[0].id;
  let x = idCabeza.slice(2, 3);
  let y = idCabeza.slice(1, 2);
  return [Number(y), Number(x) + 1];
}
function muevoIzquierda() {
  let idCabeza = vibora[0].id;
  let x = idCabeza.slice(2, 3);
  let y = idCabeza.slice(1, 2);
  return [Number(y), Number(x) - 1];
}
function muevoAbajo() {
  let idCabeza = vibora[0].id;
  let x = idCabeza.slice(2, 3);
  let y = idCabeza.slice(1, 2);
  return [Number(y) + 1, Number(x)];
}
function muevoArriba() {
  let idCabeza = vibora[0].id;
  let x = idCabeza.slice(2, 3);
  let y = idCabeza.slice(1, 2);
  return [Number(y) - 1, Number(x)];
}

function gameOver() {
  alert("Game Over");
  enPartida = false;
}

function saliDelEscenario(coordenadas) {
  if (coordenadas[0] < 0 || coordenadas[0] > 9 || coordenadas[1] < 0 || coordenadas[1] > 9) {
    alert("Saliste del escenario");
    return true;
  } else return false;
}

function choque(coordenadas) {
  if (escenario[coordenadas[0]][coordenadas[1]].classList.contains("clsVibora")) {
    alert("Chocaste");
    return true;
  }
  return false;
}

//Movemos la vibora de la siguiente forma:
//Nos guardamos una referencia de la cola (ultima posición del array vibora[]) y de la cabeza (primera posición del array vibora[])
//La nueva cabeza la recibimos por parametros.
//En el array vibora[], movemos todas las referencias 1 posición hacía atras.
//En la primer posición del array vibora[], asignamos la nueva cabeza.
//Redibujamos la viborita en la pantalla, dependiendo de si se comio un terrón de azúcar o no.
//En cazo que nos hayamos comido un terrón de azúcar, generamos uno nuevo.
function muevoCuerpo(nuevaCabeza) {
  let exCola = vibora[vibora.length - 1];
  let exCabeza = vibora[0];

  for (let i = vibora.length - 1; i >= 1; i--) {
    vibora[i] = vibora[i - 1];
  }
  vibora[0] = nuevaCabeza;

  nuevaCabeza.classList.remove("clsUnidad");
  nuevaCabeza.classList.add("clsCabezaVibora");

  exCabeza.classList.remove("clsCabezaVibora");
  exCabeza.classList.add("clsVibora");

  if (comoAzucar(nuevaCabeza)) {
    nuevaCabeza.classList.remove("clsAzucar");
    vibora.push(exCola);

    generoAzucar();
  } else {
    exCola.classList.remove("clsVibora");
    exCola.classList.add("clsUnidad");
  }
}

function comoAzucar(nuevaPosicion) {
  if (nuevaPosicion.classList.contains("clsAzucar")) return true;
  else return false;
}

//Generamos un nuevo terron de azúcar en un lugar al azar del escenario
function generoAzucar() {
  let nodos = e.querySelectorAll(".clsUnidad");
  let x = Math.floor(Math.random() * nodos.length);
  nodos[x].classList.remove("clsUnidad");
  nodos[x].classList.add("clsAzucar");
}
