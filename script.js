const app = document.querySelector('.weather-app')
const temp = document.querySelector('.temp')
const timeOutput = document.querySelector('.time')
const dateOutput = document.querySelector('.date')
const conditionOutput= document.querySelector('.condition')
const nameOutput = document.querySelector('.name')
const icon = document.querySelector('.icon')
const cloudOutput = document.querySelector('.cloud')
const humidityOutput = document.querySelector('.humidity')
const windOutput = document.querySelector('.wind')
const form = document.querySelector('#locationInput')
const search = document.querySelector('.search')
const btn = document.querySelector('.submit')
const cities = document.querySelectorAll('.city')

// Default city when the page loads
let cityInput = "London";


cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //Change from default city to the clicked one
        cityInput = e.target.innerHTML;
        /*Function that fetches and displays all the data from the Weather API */
        fetchWeatherData();
        //Fade out the app (simple animation)
        app.style.opacity = "0"
    });
});

// Add submit event to the form
form.addEventListener('submit', (e) => {
   if(search.value.length == 0) {
       alert('Please type in a city name')
   } else {
       /* Change from default city to the one written in the input field */
       cityInput = search.value
        /*Function that fetches and displays all the data from the Weather API */
       fetchWeatherData();
       // Remove all text from the input field
       search.value = "";
        //Fade out the app (simple animation)
       app.style.opacity = "0";
   }
    
   e.preventDefault();
})

/* Function that returns a day of the week from a date */
function dayOfTheWeek(day, month, year){
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()]
};


/* Function that fetches and displays the data from the weather API */
 async function fetchWeatherData() {
    /* Fecth the data and dynamicaly add the city name with template literals */

     await fetch(`https://api.weatherapi.com/v1/current.json?key=fa37e19bc85a447eac9132708220504&q=${cityInput}`)
   
    /* Take the data (which is in JSON format) and convert it to a regular JS Object */
    .then(response => response.json())
    .then(data => {

    /* You can console log the data to see what is avaiable */
    console.log(data);

     /* Let's start by adding the temperature and weather condition to the page */
     temp.innerHTML =  data.current.temp_c + "&#176;"
     conditionOutput.innerHTML = data.current.condition.text;

     // Add the name of the city into the page
     nameOutput.innerHTML = data.location.name 

    /* Get the date and time from the city and extract the day, month, year and time into individuals variables */
    const date = data.location.localtime;

    const y = parseInt(date.substr(0, 4)) // a partir da posição 0, 4 char
    const m = parseInt(date.substr(5, 2)) // a partir da posição 5, 2 char
    const d = parseInt(date.substr(8, 2)) // a partir da posição 8, 2 char
    const time = date.substr(11); // a partir da posição 11 tudo em string

    /*Reformat the date into something more appealing and add it to the page */
    // Original format: 2022-03-28
    // New Format : 15:08 - Monday 28, 04 2022
    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`
    timeOutput.innerHTML = time;

    // Add the weather details to the page
    cloudOutput.innerHTML = data.current.cloud +" %"
    humidityOutput.innerHTML = data.current.humidity+" %"
    windOutput.innerHTML = data.current.wind_kph +" km/h"

    // Set default time of the day
    let timeOfDay = "day";

    // Get the unique id for each weather condition
    const code = data.current.condition.code
    
    //Change to night if its night time in the city 
    if(!data.current.is_day){
        timeOfDay = "night";
    }

     /* Get the corresponding icon url for the weather and extrac a part of it */
     const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length);
        icon.src = `_icons/${iconId}`

    if(code == 1000) 
    {
        /* Set the background image to clear if the weather is clear */
        app.style.backgroundImage = `
            url('_images/${timeOfDay}/clear.jpg')
        `;

        /* Change the button bg color depending on if its day or night */
        btn.style.background = "#e5ba92";
        if(timeOfDay == "night"){
            btn.style.background = "#181e27"
        }
    }

    /* Same thing for cloudy weather */
    else if (
        code == 1003 || 
        code == 1006 ||
        code == 1009 ||
        code == 1030 || 
        code == 1069 ||
        code == 1087 ||
        code == 1135 || 
        code == 1273 ||
        code == 1276 ||
        code == 1279 || 
        code == 1282
    ) {
        app.style.backgroundImage = `
        url('_images/${timeOfDay}/cloudy.jpg')
        `;

        btn.style.background = "fa6d1b";
        if(timeOfDay == "night"){
            btn.style.background = "#181e27"
        }
    } else if (
        code == 1063 || 
        code == 1069 ||
        code == 1072 ||
        code == 1150 || 
        code == 1153 ||
        code == 1180 ||
        code == 1183 || 
        code == 1186 ||
        code == 1189 ||
        code == 1192 || 
        code == 1195 || 
        code == 1204 ||
        code == 1207 ||
        code == 1240 || 
        code == 1243 ||
        code == 1246 ||
        code == 1249 || 
        code == 1252 
    ){
        app.style.backgroundImage = `
        url(_images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";

        if(timeOfDay == "night"){
            btn.style.background = "#325c80"
    } else {
        app.style.backgroundImage = `
        url('_images/${timeOfDay}/snowy.jpg')`;
        
        btn.style.background = "#4d72aa";
        if(timeOfDay == "night"){
            btn.style.background = "#1b1b1b"
        }
  }
}
// Fade in the page once all is done
app.style.opacity = "1"
})
// If the user types a city that doesn't exist, throw an alert */
.catch(()=> {
  //  alert('City not found, please try again')
    app.style.opacity = "1";
  });
}

// Call the function on page load
fetchWeatherData();

//Fade in the page
app.style.opacity = "1"

function convertKelvinToCelsius(kelvin){
    let celsius = kelvin - 273;
    return celsius.toFixed(2);
}