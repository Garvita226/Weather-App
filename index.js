const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let variable = tempVal.replace('{%tempval%}', orgVal.main.temp)
    variable = variable.replace('{%tempmin%}', orgVal.main.temp_min)
    variable = variable.replace('{%tempmax%}', orgVal.main.temp_max)
    variable = variable.replace('{%city%}', orgVal.name)
    variable = variable.replace('{%country%}', orgVal.sys.country)
    variable = variable.replace('{%tempstatus%}', orgVal.weather[0].main)
    return variable;
}

const server = http.createServer((req, res) => {
    requests('http://api.openweathermap.org/data/2.5/weather?q=Lucknow&units=metric&APPID=98322916a37ab69461b2bfc9ce8e29d0')
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk)
            const arrData = [objData]
            // console.log(arrData)
            const realtimeData = arrData.map(val => replaceVal(homeFile, val)).join('')
            // console.log(realtimeData)
            res.write(realtimeData)
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
})

server.listen(8000, '127.0.0.1', () => {
    console.log('listening at port 8000')
})