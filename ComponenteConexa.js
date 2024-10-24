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

    // Retornar matriz garantizando al menos dos componentes
    return matriz;
}

// Calcular la matriz de caminos con la lógica de cierre transitivo y agregar 1's a la diagonal
function calcularMatrizCaminos(matriz) {
    let tamaño = matriz.length;
    let caminos = [...matriz];

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
        .map((fila, i) => [fila, i]) 
        .sort((a, b) => b[0].reduce((acc, val) => acc + val, 0) - a[0].reduce((acc, val) => acc + val, 0))
        .map(fila => fila[0]);
}

// Ordenar la matriz por columnas
function ordenarMatrizPorColumnas(matriz) {
    let tamaño = matriz.length;
    let ordenadas = [];
    for (let i = 0; i < tamaño; i++) {
        ordenadas[i] = [];
    }
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            ordenadas[i][j] = matriz[j][i];
        }
    }
    return ordenarMatrizPorFilas(ordenadas);
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

    // Crear nodos
    for (let i = 0; i < tamaño; i++) {
        nodos.push({ id: i + 1, label: (i + 1).toString() });
    }

    // Crear aristas
    for (let i = 0; i < tamaño; i++) {
        for (let j = 0; j < tamaño; j++) {
            if (matriz[i][j] === 1 && i !== j) {
                aristas.push({ from: i + 1, to: j + 1 });
            }
        }
    }

    // Graficar
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

    // Limitar tamaño de la matriz a un máximo de 10
    if (tamaño > 10) {
        alert("El tamaño de la matriz no puede ser mayor que 10");
        return;
    }

    // Generar matriz de adyacencia con al menos 2 componentes conexas
    let matrizAdyacencia = generarMatrizConDosComponentes(tamaño);
    document.getElementById('matrizAdyacencia').value = matrizAString(matrizAdyacencia);

    // Calcular matriz de caminos (agregar 1 a la diagonal)
    let matrizCaminosRes = calcularMatrizCaminos(matrizAdyacencia);
    document.getElementById('matrizCaminos').value = matrizAString(matrizCaminosRes);

    // Ordenar la matriz por filas
    let matrizOrdenada = ordenarMatrizPorFilas(matrizCaminosRes);
    document.getElementById('matrizOrdenada').value = matrizAString(matrizOrdenada);

    // Ordenar la matriz por columnas
    let matrizOrdenadaPorColumnas = ordenarMatrizPorColumnas(matrizOrdenada);
    document.getElementById('matrizOrdenadaColumnas').value = matrizAString(matrizOrdenadaPorColumnas);

    // Generar gráfica de componentes conexas
    generarGraficaComponentes(matrizCaminosRes);
}
