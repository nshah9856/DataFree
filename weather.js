require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports = exports = function getWeather(location){
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bfcdb6bb34f68ccc033fb9e297c8df1f`
    return fetch(url)
}


