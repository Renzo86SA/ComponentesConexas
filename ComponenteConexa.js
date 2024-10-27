// Generar una matriz de adyacencia garantizando al menos 2 componentes conexas
function generarMatrizConDosComponentes(tamaño) {
    let matriz = Array(tamaño).fill(0).map(() => Array(tamaño).fill(0));

    // Crear al menos dos componentes conexas separadas
    let mitad = Math.floor(tamaño / 2);

    // Componente 1: Llenar la mitad de la matriz como una componente conexa
    for (let i = 0; i < mitad; i++) {
        for (let j = 0; j < mitad; j++) {
            matriz[i][j] = (i === j) ? 1 : Math.floor(Math.random() * 2);
        }
    }

    // Componente 2: Llenar la otra mitad de la matriz como otra componente conexa
    for (let i = mitad; i < tamaño; i++) {
        for (let j = mitad; j < tamaño; j++) {
            matriz[i][j] = (i === j) ? 1 : Math.floor(Math.random() * 2);
        }
    }

    return matriz;
}

// Calcular la matriz de caminos con la lógica de cierre transitivo y agregar 1's a la diagonal
function calcularMatrizCaminos(matriz) {
    let tamaño = matriz.length;
    let caminos = [...matriz.map(fila => [...fila])];

    // Agregar 1 a la diagonal
    for (let i = 0; i < tamaño; i++) {
        caminos[i][i] = 1;
    }

    for (let k = 0; k < tamaño; k++) {
        for (let i = 0; i < tamaño; i++) {
            for (let j = 0; j < tamaño; j++) {
                caminos[i][j] = caminos[i][j] || (caminos[i][k] && caminos[k][j]) ? 1 : 0;
            }
        }
    }
    return caminos;
}

// Ordenar la matriz según el número de 1's en cada fila
function ordenarMatrizPorFilas(matriz) {
    return matriz
        .map((fila, i) => ({ fila, diag: fila[i], index: i }))
        .sort((a, b) => b.fila.reduce((acc, val) => acc + val, 0) - a.fila.reduce((acc, val) => acc + val, 0))
        .map(({ fila, index }) => {
            fila[index] = 1;  // Asegurar que el 1 en la diagonal se mantenga
            return fila;
        });
}

// Ordenar la matriz por columnas
function ordenarMatrizPorColumnas(matriz) {
    let tamaño = matriz.length;

    // Ordenar cada columna según el número de 1's en cada fila
    let ordenadas = Array.from({ length: tamaño }, () => Array(tamaño).fill(0));
    for (let j = 0; j < tamaño; j++) {
        let columna = matriz.map((fila, i) => ({ valor: fila[j], diag: i === j ? 1 : 0, index: i }));
        columna.sort((a, b) => b.valor - a.valor);
        columna.forEach(({ valor, diag, index }, i) => {
            ordenadas[i][j] = index === j ? 1 : valor;
        });
    }
    return ordenadas;
}

// Convertir la matriz a un string para mostrar
function matrizAString(matriz) {
    return matriz.map(fila => fila.join(" ")).join("\n");
}

// Función para generar la gráfica de componentes conexas
function generarGraficaComponentes(matriz) {
    let nodos = [];
    let aristas = [];
    let tamaño = matriz.length;

    for (let i = 0; i < tamaño; i++) {
        nodos.push({ id: i + 1, label: (i + 1).toString() });
    }

    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            if (matriz[i][j] === 1 && i !== j) {
                aristas.push({ from: i + 1, to: j + 1 });
            }
        }
    }

    let contenedor = document.getElementById('graphContainer');
    let datos = {
        nodes: new vis.DataSet(nodos),
        edges: new vis.DataSet(aristas)
    };
    let opciones = {
        nodes: {
            shape: 'circle',
            font: { color: '#ffffff' },
            color: '#007bff'
        },
        edges: {
            arrows: 'to',
            color: '#ccc'
        }
    };
    new vis.Network(contenedor, datos, opciones);
}

function generarMatrices() {
    let tamaño = parseInt(document.getElementById('size').value);

    if (tamaño > 10) {
        alert("El tamaño de la matriz no puede ser mayor que 10");
        return;
    }

    let matrizAdyacencia = generarMatrizConDosComponentes(tamaño);
    document.getElementById('matrizAdyacencia').value = matrizAString(matrizAdyacencia);

    let matrizCaminosRes = calcularMatrizCaminos(matrizAdyacencia);
    document.getElementById('matrizCaminos').value = matrizAString(matrizCaminosRes);

    let matrizOrdenada = ordenarMatrizPorFilas(matrizCaminosRes);
    document.getElementById('matrizOrdenada').value = matrizAString(matrizOrdenada);

    let matrizOrdenadaPorColumnas = ordenarMatrizPorColumnas(matrizOrdenada);
    document.getElementById('matrizOrdenadaColumnas').value = matrizAString(matrizOrdenadaPorColumnas);

    generarGraficaComponentes(matrizCaminosRes);
}
function mostrarMatrizManual() {
    const tamaño = parseInt(document.getElementById('size').value);
    const manualMatrixContainer = document.getElementById("manualMatrix");
    manualMatrixContainer.innerHTML = ''; // Limpiar matriz anterior
  
    if (isNaN(tamaño) || tamaño < 2 || tamaño > 10) {
      alert("Ingrese un tamaño de matriz válido (entre 2 y 10).");
      return;
    }
  
    // Crear casillas de verificación
    manualMatrixContainer.style.gridTemplateColumns = `repeat(${tamaño}, 30px)`;
    for (let i = 0; i < tamaño; i++) {
      for (let j = 0; j < tamaño; j++) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = i === j; // Poner 1 en la diagonal
        manualMatrixContainer.appendChild(checkbox);
      }
    }
  
    manualMatrixContainer.style.display = "grid";
  }
  
  // Generar matriz de adyacencia a partir de entrada manual o automáticamente
  function generarMatrizAdyacencia(tamaño) {
    const manualEntry = document.getElementById("manualEntryCheckbox").checked;
    let matriz = Array(tamaño).fill(0).map(() => Array(tamaño).fill(0));
  
    if (manualEntry) {
      const checkboxes = document.querySelectorAll("#manualMatrix input[type='checkbox']");
      checkboxes.forEach((checkbox, index) => {
        const row = Math.floor(index / tamaño);
        const col = index % tamaño;
        matriz[row][col] = checkbox.checked ? 1 : 0;
      });
    } else {
      matriz = generarMatrizConDosComponentes(tamaño);
    }
  
    return matriz;
  }
  
  // Función para generar matrices y gráfica
  function generarMatrices() {
    const tamaño = parseInt(document.getElementById('size').value);
  
    if (isNaN(tamaño) || tamaño < 2 || tamaño > 10) {
      alert("Ingrese un tamaño de matriz válido (entre 2 y 10).");
      return;
    }
  
    // Generar matriz de adyacencia (manual o automática)
    const matrizAdyacencia = generarMatrizAdyacencia(tamaño);
    document.getElementById('matrizAdyacencia').value = matrizAString(matrizAdyacencia);
  
    // Calcular matriz de caminos
    const matrizCaminos = calcularMatrizCaminos(matrizAdyacencia);
    document.getElementById('matrizCaminos').value = matrizAString(matrizCaminos);
  
    // Ordenar matriz por filas
    const matrizOrdenada = ordenarMatrizPorFilas(matrizCaminos);
    document.getElementById('matrizOrdenada').value = matrizAString(matrizOrdenada);
  
    // Ordenar matriz por columnas
    const matrizOrdenadaColumnas = ordenarMatrizPorColumnas(matrizOrdenada);
    document.getElementById('matrizOrdenadaColumnas').value = matrizAString(matrizOrdenadaColumnas);
  
    // Generar gráfica de componentes conexas
    generarGraficaComponentes(matrizCaminos);
  }
  
  // Mostrar la matriz manual cuando se selecciona la opción
  document.getElementById("manualEntryCheckbox").addEventListener("change", function() {
    if (this.checked) {
      mostrarMatrizManual();
    } else {
      document.getElementById("manualMatrix").style.display = "none";
    }
  });
