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

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {}
};

let tafelDiv = document.getElementById('tafelDiv');
let tafelRows = document.getElementById('tafels');

document.getElementById('tafelDiv').remove();

let httpRequest = new XMLHttpRequest();
let url = 'http://localhost:2435/';
httpRequest.open("GET", url, true);
httpRequest.send();

let amps;

httpRequest.onloadend = (e) => {
  let response = JSON.parse(httpRequest.responseText);
  console.log(response);

  for(let i = 0; i < response.length; i++) {
    let ampereArray = response[i].ampere;
    amps = ampereArray[ampereArray.length-1];
    setTable(i, amps, 230, amps*230, 100);
  }
}

const chart = new Chart(
  document.getElementById('tafelChart'),
  config
);

function setTable(number, amps, volt, kwh, cost) {
  let div = document.createElement('div');
  let element =
  `<div class="row gx-0 mb-5 mb-lg-0 justify-content-center" id=${"tafel"+number}>
      <div class = "chart">
          <canvas id="tafelChart" width="432px" height="319px"></canvas>
      </div>
      <div class="col-lg-6">
          <div class="bg-black text-center h-100 project">
              <div class="d-flex h-100">
                  <div class="project-text w-100 my-auto text-center text-lg-left">
                      <h4 class="text-white" id='tafelNaam'>Informatie Tafel ${number+1}</h4>
                      <ul class="mb-0 text-white-50">
                          <li id='ampere'>Ampere: ${amps}</li>
                          <li id='voltage'>Voltage: ${volt}</li>
                          <li id='kwh'>KW/h: ${kwh}</li>
                          <li id='kosten'>€/h: ${cost}</li>
                      </ul>
                      <hr class="d-none d-lg-block mb-0 ms-0" />
                  </div>
              </div>
          </div>
      </div>
  </div>`;
  div.innerHTML = element;

  document.getElementById('tafels').appendChild(div);
}