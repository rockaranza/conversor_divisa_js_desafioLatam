const convertirBtn = document.getElementById("btn");
const url =  'https://mindicador.cl/api';
let monedasDisponibles;
let chart;

// Carga las monedas
function cargarMonedas() {
  try {
      fetch(url)
          .then(function(response) {
              if (!response.ok) {
                  throw new Error('La solicitud no fue exitosa');
              }
              return response.json();
          })
          .then(function(data) {
              monedasDisponibles = data;
              mostrarMonedas();
          })
          .catch(function(error) {
              console.log('Error en la solicitud:', error);
          });
  } catch (error) {
      console.log('Error al cargar las monedas:', error);
  }
}

// Muestra monedas en el select
function mostrarMonedas() {
    let selectMoneda = document.getElementById("moneda-select");
    
    for (let moneda in monedasDisponibles) {
        if (moneda !== "version" && moneda !== "autor" && moneda !== "fecha") {
            let option = document.createElement("option");
            option.text = moneda;
            selectMoneda.add(option);
        }
    }
}

//Convertir valores
function convertir() {
  let montoCLP = parseFloat(document.getElementById("monto-clp").value);
  let monedaSeleccionada = document.getElementById("moneda-select").value;
  let valorMoneda = monedasDisponibles[monedaSeleccionada].valor;
  let resultado = montoCLP / valorMoneda;

  document.getElementById("resultado").innerText = resultado.toFixed(2) + " " + monedaSeleccionada;
  
  //Llamada a funcion para mostrar cambios anuales
  obtenerDatosCambioAnual(monedaSeleccionada);
}

//Funciones para obtener los cambios anuales
function obtenerDatosCambioAnual(moneda) {
  let year = new Date().getFullYear();
  fetch(`${url}/${moneda}/${year}`)
      .then(function(response) {
          return response.json();
      })
      .then(function(data) {
          dibujarGrafico(data, moneda);
      })
      .catch(function(error) {
          console.log('Error en la solicitud:', error);
      });
}

//Funcion para graficar
function dibujarGrafico(data, moneda) {
  if (chart) {
      chart.destroy(); // Destruir el gráfico anterior si existe
  }
  let ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: data.serie.map(entry => entry.fecha),
          datasets: [{
              label: `Cambio anual de ${moneda}`,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: data.serie.map(entry => entry.valor),
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: false
                  }
              }]
          }
      }
  });
}

convertirBtn.addEventListener("click", convertir);
cargarMonedas();