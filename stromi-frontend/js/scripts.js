/*!
* Start Bootstrap - Grayscale v7.0.4 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

  // Navbar shrink function
  var navbarShrink = function () {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
          return;
      }
      if (window.scrollY === 0) {
          navbarCollapsible.classList.remove('navbar-shrink')
      } else {
          navbarCollapsible.classList.add('navbar-shrink')
      }

  };

  // Shrink the navbar 
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener('scroll', navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
      new bootstrap.ScrollSpy(document.body, {
          target: '#mainNav',
          offset: 74,
      });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
      document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener('click', () => {
          if (window.getComputedStyle(navbarToggler).display !== 'none') {
              navbarToggler.click();
          }
      });
  });

});

let tafelDiv = document.getElementById('tafelDiv');
let tafelRows = document.getElementById('tafels');

document.getElementById('tafelDiv').remove();

let httpRequest = new XMLHttpRequest();
let url = 'http://localhost:2435/';
requestTable();

setInterval(requestTable, 10000);

function requestTable() {
  httpRequest.open("GET", url, true);
  httpRequest.send();

  httpRequest.onloadend = (e) => {
    let response = JSON.parse(httpRequest.responseText);

    for(let i = 0; i < response.length; i++) {
      let ampereArray = response[i].ampere;
      let amps;
      for(key in ampereArray[ampereArray.length-1]) {
        amps = (ampereArray[ampereArray.length-1][key]).toFixed(3);
      }

      let kwh = ((amps*230/1000)).toFixed(2);
      let price = (kwh * .24).toFixed(3);
      setTable(response[i].tafelNummer, ampereArray, amps, 230, kwh, price);
    }
  }
}

function setTable(number, ampereArray, amps, volt, kwh, cost) {
  let div = document.createElement('div');
  let element =
  `<div class="row gx-0 mb-5 mb-lg-0 justify-content-center" id=${"tafel"+number}>
      <div class = "chart">
          <canvas id="tafelChart${number}" width="432px" height="319px"></canvas>
      </div>
      <div class="col-lg-6">
          <div class="bg-black text-center h-100 project">
              <div class="d-flex h-100">
                  <div class="project-text w-100 my-auto text-center text-lg-left">
                      <h4 class="text-white" id='tafelNaam'>Stroomverbruik Tafel ${number}</h4>
                      <ul class="mb-0 text-white-50">
                          <li id='ampere'>Ampere: ${amps}A</li>
                          <li id='voltage'>Voltage: ${volt}V</li>
                          <li id='kwh'>KW/h: ${kwh}KWh</li>
                          <li id='kosten'>€/h: €${cost}</li>
                      </ul>
                      <hr class="d-none d-lg-block mb-0 ms-0" />
                  </div>
              </div>
          </div>
      </div>
  </div>`;
  div.innerHTML = element;

  if(document.getElementById("tafel"+number) == null) {
    document.getElementById('tafels').appendChild(div);
  } else {
    document.getElementById("tafel"+number).remove();
    document.getElementById('tafels').appendChild(div);
  }
  
  labels = [];
  ampData = [];
  for(index in ampereArray) {
    let millis = Object.keys(ampereArray[index])[0];
    let date = new Date(parseInt(millis));
    let uur = ('0' + date.getHours().toString()).slice(-2);
    let minuut = ('0' + date.getMinutes().toString()).slice(-2);
    let amp = ampereArray[index][millis];

    labels.push(uur + ":" + minuut);
    ampData.push(amp);
  }

  const data = {
    labels: labels,
    datasets: [{
      label: 'Verbruik tafel ' + number + ' (laatste uur)',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: ampData,
    }]
  };
  
  const config = {
    type: 'line',
    data: data,
    options: {}
  };

  new Chart(
    document.getElementById('tafelChart' + number),
    config
  );
}