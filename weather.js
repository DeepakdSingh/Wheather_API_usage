
import express from "express";
import path from "path";
import https from "https";
import pkg from "dotenv";
pkg.config();


const app = express();
app.use(express.urlencoded({extended: true}));


const __dirname = path.resolve();
app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
});



const apiKey = process.env.API_KEY;
const unit = "metric";
app.post("/", (req, res)=>{
    let city = req.body.city;
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid="+apiKey;

    https.get(apiUrl, (response)=>{
        response.on("data", (data)=>{
            let weatherObj = JSON.parse(data);
            let description = weatherObj.weather[0].description;
            let iconUrl = "http://openweathermap.org/img/wn/" + weatherObj.weather[0].icon + "@2x.png";
            let temperature = weatherObj.main.temp;

            res.write("<p>The weather condition is " + description +"</p>");
            res.write("<h1>Temperature in "+ city +" is "+ temperature +" degree celcius</h1>");
            res.write("<img src=" + iconUrl + ">");
            res.send();
        });
    });
});


app.listen(3000, ()=>{
    console.log("server is deployed on 3000 port");
});