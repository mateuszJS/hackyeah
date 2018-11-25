export const updatePlace = function (newCountry, newCity) {
  Array.from(document.querySelectorAll(".col--hidden")).forEach(node => node.classList.remove('col--hidden'));
  const country = document.getElementById("id_country"),
  city = document.getElementById("id_city");  
  country.innerHTML = newCountry;
  city.innerHTML = newCity;
}

export const updatePrice = function (newPrice) {
  const price = document.getElementById("id_price");  
  price.innerHTML = newPrice;    
}
