document.getElementById("btnJugar").addEventListener("click", jugar);
//document.addEventListener("keydown", muevoViborita);
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
  tiempo();
}

async function tiempo() {
  let myPromise = new Promise(function (resolve) {
    setTimeout(function () {
      if (enPartida) {
        resolve(tiempo());
        muevoViborita();
      }
      //tiempo();
    }, 250);
  });
  //  if (enPartida) await setTimout(tiempo, 3000);
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

function muevoViborita() {
  if (!enPartida) return;

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
    gameOver();
    return;
  }

  let nuevaCabeza = escenario[coordenadas[0]][coordenadas[1]];
  muevoCuerpo(nuevaCabeza);
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
function muevoCuerpo(nuevaCabeza) {
  let exCola = vibora[vibora.length - 1];
  let cuello = vibora[0];

  for (let i = vibora.length - 1; i >= 1; i--) {
    vibora[i] = vibora[i - 1];
  }
  vibora[0] = nuevaCabeza;

  nuevaCabeza.classList.remove("clsUnidad");
  nuevaCabeza.classList.add("clsCabezaVibora");

  cuello.classList.remove("clsCabezaVibora");
  cuello.classList.add("clsVibora");

  if (comoAzucar(nuevaCabeza)) {
    nuevaCabeza.classList.remove("clsAzucar");
    vibora.push(exCola);

    generoAzucar();
  } else {
    exCola.classList.remove("clsVibora");
    exCola.classList.add("clsUnidad");
  }
}

function generoAzucar() {
  let nodos = e.querySelectorAll(".clsUnidad");
  let x = Math.floor(Math.random() * nodos.length);
  nodos[x].classList.remove("clsUnidad");
  nodos[x].classList.add("clsAzucar");
}

function comoAzucar(nuevaCabeza) {
  if (nuevaCabeza.classList.contains("clsAzucar")) return true;
  else return false;
}

function saliDelEscenario(coordenadas) {
  if (
    coordenadas[0] < 0 ||
    coordenadas[0] > 9 ||
    coordenadas[1] < 0 ||
    coordenadas[1] > 9
  ) {
    alert("Saliste del escenario");
    return true;
  } else return false;
}

function choque(coordenadas) {
  if (
    escenario[coordenadas[0]][coordenadas[1]].classList.contains("clsVibora")
  ) {
    alert("Chocaste");
    return true;
  }
  return false;
}

function gameOver() {
  alert("Game Over");
  enPartida = false;
}
