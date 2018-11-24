export const updatePlace = function (newCountry, newCity) {
  console.log('update place');
  var country = document.getElementById("id_country"),
  city = document.getElementById("id_city");  
  country.innerHTML = newCountry;
  city.innerHTML = newCity;
}

export const updatePrice = function (newPrice) {
  var price = document.getElementById("id_price");  
  price.innerHTML = newPrice;    
}
