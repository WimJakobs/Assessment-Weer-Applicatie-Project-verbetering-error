console.log("Weer-Applicatie Project");


/* ------ De API Key -----------------------------------*/ 
const appid = "67aa36302407f8d80b26c356d51ebce5";


/* ------ invoerveld en button uit HTML ophalen ------- */
const locatie = document.getElementById("locatie");
  console.log("locatie", locatie);
const ophaalKnop = document.getElementById("knopDataOphalen");




/* ------ uitvoervelden uit HTML ophalen ------- */
const uitvoerID = {
    plaats: document.getElementById("plaats"),
    tijdstip: document.getElementById("tijdstip"),
    temperatuur: document.getElementById("temperatuur"),
    windrichting: document.getElementById("windrichting"),
    windsnelheid: document.getElementById("windsnelheid"),
    vochtigheid: document.getElementById("vochtigheid"),
    weerconditie: document.getElementById("weerconditie"),

    weersymbool: document.getElementById("weersymbool")
}




/* ------- eventListener toekennen -----*/ 

ophaalKnop.addEventListener("click", dataOphalen);



/* ------- testwaarden ------- */
let lat="52.23";      //om te testen: enschede:  52.23
let lon="6.88";       //om te testen: enschede:  6.88



/* ------------------ uitvoervelden ------------------- */

const weerActueel = {
    plaats: "", 
    tijdstip: "",
    temperatuur: 0,
    weerconditie: "", 
    windrichting: 0,
    windsnelheid: 0,
    vochtigheid: 0,
    weersymbool: "",
};



/* ------------------ Data ophalen en in DOM plaatsen  --------------------- */
/* aan te roepen vanaf eventListener */
async function dataOphalen() {
    console.log("---------------- dataOphalen() ------------------");
    

    
    try {
        const geoAPIvar = await geoAPI();
        await weatherAPI();
        //console.log('dataOphalen(): data is opgehaald');
        dataPlaatsen();
        ophaalKnop.innerHTML= "Haal weerdata op"   // is nodig indien in vorig geval plaats niet herkent is of invulvak leeg is aangeklikt. Beste zou zijn een vergelijking maar tijd ontbreekt.
    } catch(err) { 
        //console.log("dataOphalen(): error:",  err)
        if (err==="Lege plaats") { ophaalKnop.innerHTML= "Er is niets ingevuld. Probeer opnieuw en klik op deze knop" }
        if (err==="onherkenbare plaats") { ophaalKnop.innerHTML= "Plaats niet herkent. Probeer opnieuw en klik op deze knop" }
        
    }
}

/* ------------------ GEO API ----------------------------- */ 


function geoAPI() {
    
    return new Promise( (deFunctie, reject) => {     
    
            let samengesteldUrlGEO;    

            
            const urlGEO = 'http://api.openweathermap.org/geo/1.0/direct?';

            locatiePlaatsnaam = locatie.value;
            samengesteldUrlGEO = urlGEO + "q=" + locatiePlaatsnaam +"&appid=" + appid ;

            console.log("geoAPI: samengesteldUrlGEO", samengesteldUrlGEO);


            fetch(samengesteldUrlGEO)
            .then( (response) => { 
                console.log("geoAPI: 1ste then (response):",response);
                
                if (response.ok===false) {
                    console.log("geoAPI: 1ste then (response): ERROR", response);
                    reject("Lege plaats");
                }
                return response.json(); 
            }, (reject) => { return "bijzondere error"})
            .then( (data) => { 
                if (data.cod != "400" && data.length != 0) {             //code 400 wordt in ieder geval gegenereerd wanneer niets is ingevuld in plaats/locatie.
                    console.log("geoAPI: data", data);
                    lat=data[0].lat;
                    lon=data[0].lon;
                    console.log("geoAPI: lat", lat);
                    console.log("geoAPI: lon", lon);
                    deFunctie("geslaagd");
                } else if (data.length == 0) {
                    reject("onherkenbare plaats");
                }
            })
            .catch( (geweigerd) => { 
                console.log("Error: onherkenbare plaats");
                console.log(geweigerd);
                reject("onherkenbare plaats");
            })
    });
}


/* ------------------ WeatherAPI -------------------------- */


function weatherAPI(){

    return new Promise( (resolve) => {
        const url = "https://api.openweathermap.org/data/2.5/weather?";
        const units="metric";
        const samengesteldURLweather = url + "lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=" + units + "&lang=nl";

        //console.log("weatherAPI:samengesteldURLweather", samengesteldURLweather);
        //console.log(typeof samengesteldURLweather);

        fetch(samengesteldURLweather)
            
            .then ((response) => { 
                return response.json(); 
            }) 
            
            .then((data) => { 
                    console.log("weatherAPI: data", data); 
                
                weerActueel.plaats = data.name;
                    console.log("weatherAPI: plaats :", weerActueel.plaats)
                weerActueel.tijdstip = data.dt;
                    console.log("weatherAPI: tijdstip :", data.dt);
                weerActueel.temperatuur = data.main.temp;
                    console.log("weatherAPI: temperatuur :", weerActueel.temperatuur);
                weerActueel.windrichting = data.wind.deg;
                    console.log("weatherAPI: windrichting:", weerActueel.windrichting);
                weerActueel.windsnelheid = data.wind.speed;
                    console.log("weatherAPI: windsnelheid:", weerActueel.windsnelheid);
                weerActueel.vochtigheid = data.main.humidity;
                    console.log("weatherAPI: vochtigheid :", weerActueel.vochtigheid);
                weerActueel.weerconditie = data.weather[0].description; 
                    console.log("weatherAPI: weerconditie:", weerActueel.weerconditie);

                weerActueel.weersymbool = data.weather[0].icon;
                    console.log("weatherAPI: weerSymbool :", weerActueel.weersymbool);
                
                resolve();
                

            });
    });

}


/* ------------------ Opgehaalde data plaatsen -------------------------- */

function dataPlaatsen() {

    uitvoerID.plaats.innerText = weerActueel.plaats;


    const dateObj = new Date(weerActueel.tijdstip * 1000);
        console.log("dataPlaatsen(): dateObj: ", dateObj); 
    const timeString = dateObj.toTimeString();
        console.log("dataPlaatsen(): dateObj: timeString: ", timeString);
    const time = timeString.slice(0, 8);
        console.log("dataPlaatsen(): dateObj: time: ", time);

    uitvoerID.tijdstip.innerText = time;

    uitvoerID.temperatuur.innerText = Number.parseFloat(weerActueel.temperatuur).toFixed(1).replace('.', ',') + String.fromCharCode(176) + "C";
    
    uitvoerID.windrichting.innerText = windrichtingLettersFunc(weerActueel.windrichting) + " ("+ weerActueel.windrichting + String.fromCharCode(176) + ")";
    
    uitvoerID.windsnelheid.innerText = windsnelheidNaarBft(weerActueel.windsnelheid) + " bft" + String.fromCharCode(32) + String.fromCharCode(32) + "(" + Number.parseFloat(weerActueel.windsnelheid).toFixed(1).replace('.', ',') + " m/s; " + (Number.parseFloat(weerActueel.windsnelheid) * 3.6).toFixed(1).replace('.', ',') + " km/u)";
    uitvoerID.vochtigheid.innerText = weerActueel.vochtigheid + "%";
    uitvoerID.weerconditie.innerText = weerActueel.weerconditie.charAt(0).toUpperCase() + weerActueel.weerconditie.slice(1);

    const source = "./images/" + weerActueel.weersymbool + ".png";
    console.log("dataPlaatsen():", source);
    uitvoerID.weersymbool.setAttribute('src', source);
}






/* ------------------ windrichting van graden naar letteraanduiding -------------------------- */

function windrichtingLettersFunc(graden) {

    let windteller=0
    for (windteller=1; windteller<=16; windteller++) {
        if (graden>=(windteller*22.5-12.5) && graden<(windteller*22.5+12.5)) {
            break;
        }
    }
    
    switch(windteller) {
        case 1: return "NNO"; break;
        case 2: return "NO"; break;
        case 3: return "ONO"; break;
        case 4: return "O"; break;
        case 5: return "OZO"; break;
        case 6: return "ZO"; break;
        case 7: return "ZZO"; break;
        case 8: return "Z"; break;
        case 9: return "ZZW"; break;
        case 10: return "ZW"; break; 
        case 11: return "WZW";break; 
        case 12: return "W"; break;
        case 13: return "WNW"; break;
        case 14: return "NW"; break;
        case 15: return "NNW"; break;
        default: return "N"; break;

    }
    
}



function windsnelheidNaarBft(windsnelheid) {


    switch(true) {
        case ((windsnelheid >= 0.00 && windsnelheid <= 0.29) ):
            return 0; break;
        case ((windsnelheid >= 0.30 && windsnelheid <= 1.59) ):
            return 1; break;
        case ((windsnelheid >= 1.60 && windsnelheid <= 3.39) ):
            return 2; break;
        case ((windsnelheid >= 3.40 && windsnelheid <= 5.49) ):
            return 3; break;
        case ((windsnelheid >= 5.50 && windsnelheid <= 7.99) ):
            return 4; break;
        case ((windsnelheid >= 8.00 && windsnelheid <= 10.79) ):
            return 5; break;
        case ((windsnelheid >= 10.80 && windsnelheid <= 13.89) ):
            return 6; break;
        case ((windsnelheid >= 13.90 && windsnelheid <= 17.19) ):
            return 7; break;
        case ((windsnelheid >= 17.20 && windsnelheid <= 20.79) ):
            return 8; break;
        case ((windsnelheid >= 20.80 && windsnelheid <= 24.49) ):
            return 9; break;
        case ((windsnelheid >= 24.50 && windsnelheid <= 28.49) ):
            return 10; break;
        case ((windsnelheid >= 28.50 && windsnelheid <= 32.69) ):
            return 11; break;
        case ((windsnelheid >= 32.70) ):
            return 12; break;

        default: return "?"; break;

    }


}




