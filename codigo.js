var tabela = document.querySelector('.tabela'); //tabela do html que vai receber as células do campo minado
var x = 0; //variável auxiliar
var resultado = document.querySelector('#resultado');
var texto = document.querySelector('#texto');

var campo = new Array(16); //vetor que vira a matriz e corresponde ao campo minado
var linhas = new Array(16); //vetor para criar as tr

//CRIAÇÃO DA MATRIZ DO CAMPO
for (var i = 0; i < campo.length; i++) {
    campo[i] = new Array(16);
}
//-----------------------------

const noRightClick = tabela;

noRightClick.addEventListener("contextmenu", e => e.preventDefault());

var contador = document.querySelector('.contagem_bombas');

for (var i = 0; i < campo.length; i++) {
    for (var j = 0; j < campo[0].length; j++) {

        //Alocação das células
        if ((i * campo.length + j) % campo.length == 0) {
            linhas[i] = document.createElement('tr');
            tabela.appendChild(linhas[i]);
        }

        campo[i][j] = document.createElement("td");
        linhas[i].appendChild(campo[i][j]);
        //--------------------

        campo[i][j].value = Math.floor(Math.random() * 4); //Preenchimento com valores entre 0 e 3; 0 == bomba
        if (campo[i][j].value == 0) {
            x++;
        }

        campo[i][j].classList.add(i * linhas.length + j);
    }
}

contador.value = x;
var contadorFixo = contador.value;
contador.textContent = "Bombas: " + contador.value;

var botao = document.createElement('BUTTON');
texto.appendChild(botao);
botao.classList.add('botao');
botao.textContent = 'RECOMEÇAR';
botao.addEventListener('click', recomecar);


//EVENTO DE CLIQUE QUE CORRESPONDE A PARTE PRINCIPAL DO JOGO
function clique(event) {
    if (event.target.tagName == 'TD') {
        if (!event.target.parentNode.parentNode.classList.contains('acabou')) {
            if (event.button == 2) {

                

                if (event.target.classList.contains('bandeira')) {
                    event.target.classList.remove('bandeira');
                    contador.value++;
                    contador.textContent = 'Bombas: ' + contador.value;
                } else if (!event.target.classList.contains('aberta')) {
                    event.target.classList.add('bandeira');
                    contador.value--;
                    contador.textContent = 'Bombas: ' + contador.value;
                }
                condicaoVitoria(1);

            } else if (event.button == 0) {

                if (event.target.classList.contains('bandeira')) {
                    event.target.classList.remove('bandeira');
                }

                for (j = 0; j < 256; j++) {
                    if (event.target.classList.contains(j)) {
                        var valorTd = j;
                    }
                }

                calcularBombas(valorTd);
                condicaoVitoria(0);
            }
        }
    }


}


function calcularBombas(td) {
    var lin;
    var posit;
    var vizinhos;
    var c = 0;

    lin = Math.floor(td / campo.length);
    posit = (td + campo.length) % campo.length;

    if (campo[lin][posit].value == 0) {

        event.target.parentNode.parentNode.classList.add('acabou');

        for (var i = 0; i < campo.length; i++) {
            for (var j = 0; j < campo.length; j++) {
                var y = campo[i][j];
                if (y.value == 0) {
                    if (!y.classList.contains('bandeira')) {
                        y.classList.add('fimJogo');
                    } else {
                        y.classList.add('fimJogoBandeira');
                    }
                }
            }
        }

        event.target.classList.add("explodiu");

        resultado.textContent = 'Derrota...';

    } else if (campo[lin][posit].classList.contains('aberta')) {

        vizinhos = listarVizinhos(td);

        vizinhos.forEach(function (vizinho) {
            if (campo[Math.floor(vizinho / campo.length)][(vizinho + campo.length) % campo.length].classList.contains('bandeira')) {
                c++;
            }
        });

        if (c == campo[lin][posit].textContent) {
            vizinhos.forEach(function (vizinho) {
                if (vizinho != td && !campo[Math.floor(vizinho / campo.length)][(vizinho + campo.length) % campo.length].classList.contains('aberta') && !campo[Math.floor(vizinho / campo.length)][(vizinho + campo.length) % campo.length].classList.contains('bandeira')) {
                    calcularBombas(vizinho);
                }
            });
        }

    } else {
        c = 0;

        vizinhos = listarVizinhos(td);

        for (var i = 0; i < vizinhos.length; i++) {

            lin = Math.floor(vizinhos[i] / campo.length);
            posit = (vizinhos[i] + campo.length) % campo.length;

            if (campo[lin][posit].value == 0) {
                c++;
            }
        }

        lin = Math.floor(td / campo.length);
        posit = (td + campo.length) % campo.length;

        if (c == 0) {
            campo[lin][posit].textContent = '';
            campo[lin][posit].classList.add("aberta");
            vizinhos.forEach(function (vizinho) {
                if (vizinho != td && !campo[Math.floor(vizinho / campo.length)][(vizinho + campo.length) % campo.length].classList.contains('aberta')) {
                    calcularBombas(vizinho);
                }
            });
        } else {
            campo[lin][posit].textContent = c;
            campo[lin][posit].classList.add("aberta");
        }


        contadorFixo++;

    }
}

function listarVizinhos(n) {

    var lin = Math.floor(n / campo.length);
    var posit = (n + campo.length) % campo.length;

    var vizinhos = Array(8);

    if (lin == 0) {
        vizinhos[0] = n;
        vizinhos[1] = n;
        vizinhos[2] = n;

        if (posit == 0) {
            vizinhos[3] = n;
            vizinhos[4] = lin * campo.length + (posit + 1);
            vizinhos[5] = n;
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = (lin + 1) * campo.length + (posit + 1);

        } else if (posit == campo.length - 1) {
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = n;
            vizinhos[5] = (lin + 1) * campo.length + (posit - 1);
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = n;

        } else {
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = lin * campo.length + (posit + 1);
            vizinhos[5] = (lin + 1) * campo.length + (posit - 1);
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = (lin + 1) * campo.length + (posit + 1);
        }

    } else if (lin == campo.length - 1) {
        vizinhos[5] = n;
        vizinhos[6] = n;
        vizinhos[7] = n;
        if (posit == 0) {
            vizinhos[0] = n;
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = (lin - 1) * campo.length + (posit + 1);
            vizinhos[3] = n;
            vizinhos[4] = lin * campo.length + (posit + 1);

        } else if (posit == campo.length - 1) {
            vizinhos[0] = (lin - 1) * campo.length + (posit - 1);
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = n;
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = n;
        } else {
            vizinhos[0] = (lin - 1) * campo.length + (posit - 1);
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = (lin - 1) * campo.length + (posit + 1);
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = lin * campo.length + (posit + 1);
        }
    } else {

        if (posit == 0) {
            vizinhos[0] = n;
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = (lin - 1) * campo.length + (posit + 1);
            vizinhos[3] = n;
            vizinhos[4] = lin * campo.length + (posit + 1);
            vizinhos[5] = n;
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = (lin + 1) * campo.length + (posit + 1);
        } else if (posit == campo.length - 1) {
            vizinhos[0] = (lin - 1) * campo.length + (posit - 1);
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = n;
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = n;
            vizinhos[5] = (lin + 1) * campo.length + (posit - 1);
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = n;
        } else {
            vizinhos[0] = (lin - 1) * campo.length + (posit - 1);
            vizinhos[1] = (lin - 1) * campo.length + posit;
            vizinhos[2] = (lin - 1) * campo.length + (posit + 1);
            vizinhos[3] = lin * campo.length + (posit - 1);
            vizinhos[4] = lin * campo.length + (posit + 1);
            vizinhos[5] = (lin + 1) * campo.length + (posit - 1);
            vizinhos[6] = (lin + 1) * campo.length + posit;
            vizinhos[7] = (lin + 1) * campo.length + (posit + 1);
        }
    }

    return vizinhos;

}

/*
    vizinhos[0] = (lin - 1) * campo.length + (posit - 1);
    vizinhos[1] = (lin - 1) * campo.length + posit;
    vizinhos[2] = (lin - 1) * campo.length + (posit + 1);
    vizinhos[3] = lin * campo.length + (posit - 1);
    vizinhos[4] = lin * campo.length + (posit + 1);
    vizinhos[5] = (lin + 1) * campo.length + (posit - 1);
    vizinhos[6] = (lin + 1) * campo.length + posit;
    vizinhos[7] = (lin + 1) * campo.length + (posit + 1);
*/

function recomecar() {

    tabela.classList.remove('acabou');
    resultado.textContent = '';

    contador.value = 0;

    for (var i = 0; i < campo.length; i++) {
        for (var j = 0; j < campo[0].length; j++) {
            campo[i][j].removeAttribute('class');
            campo[i][j].textContent = '';
            campo[i][j].classList.add(i * linhas.length + j);
            campo[i][j].value = Math.floor(Math.random() * 4);
            if (campo[i][j].value == 0) {
                contador.value++;
            }
        }
    }
    contadorFixo = contador.value;

    contador.textContent = "Bombas: " + contador.value;
}

function condicaoVitoria(a) {
    
    if (contadorFixo == campo.length * campo[0].length) {
        event.target.parentNode.parentNode.classList.add('acabou');
        resultado.textContent = 'Vitória!';
    }
}