
var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var destArray=[];

function checkSrg(c){
    for (var i=0; i<destArray.length; i++){
        if(c.toUpperCase()===destArray[i]){
            return -1;
        }
    }
    return 1;
}

var APIKey="d82766c5fd16078d840c13b20191b98f";

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
        
    }
}

function currentWeather(city){
   
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);
       
        var weatherThum= response.weather[0].icon;
        var iconsrc="https://openweathermap.org/img/wn/"+weatherThum +"@2x.png";
        
        $(currentCity).html(response.name + "<img src="+iconsrc+">");
                var tempC = (response.main.temp - 273.15);
        console.log(tempC)
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempC).toFixed(0)+ "&#8451 " +"(" +(tempF).toFixed(2)+"&#8457"+")");
     
        $(currentHumidty).html(response.main.humidity+"%");
       
        var ws=response.wind.speed;
        var wSpeed=(ws).toFixed(1);
        $(currentWSpeed).html(wSpeed+"+KM/H");
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            destArray=JSON.parse(localStorage.getItem("cityname"));
                       if (destArray==null){
                destArray=[];
                destArray.push(city.toUpperCase());
                localStorage.setItem("cityname",JSON.stringify(destArray));
                addToList(city);
            }
            else {
                if(checkSrg(city)>0){
                    destArray.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(destArray));
                    addToList(city);
                }
            }
        }

    });
}
    
function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).text("  " + response.value);
            });
}
    

function forecast(cityid){
  
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconsrc="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
           
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconsrc+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}


function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}

function pastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}


function loadlastCity(){
    $("ul").empty();
    var destArray = JSON.parse(localStorage.getItem("cityname"));
    if(destArray!==null){
        destArray=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<destArray.length;i++){
            addToList(destArray[i]);
        }
        city=destArray[i-1];
        currentWeather(city);
    }

}

function clearHistory(event){
    event.preventDefault();
    destArray=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click",displayWeather);
$(document).on("click",pastSearch);

$("#clear-history").on("click",clearHistory);





















