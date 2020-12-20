
var currentUvindex= $("#uv-index");
function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                var danger = response.value;
                console.log(danger); 
                $("#uv-index" ).removeClass( [ "tooMuchSun", ".moderateSun" , ".noSun"] );
                if (danger > 6)
                   { 
                       $(currentUvindex).text("  " + response.value + "  - UV index high, wear sunscreen");
                       $("#uv-index").addClass("tooMuchSun");
                       
                 }
              

                 else if (danger > 3)
                   { 
                       $(currentUvindex).text("  " + response.value + "  - UV index moderate");
                       $("#uv-index").addClass(".moderateSun");
                      
                 }

                 else 
                 { 
                     $(currentUvindex).text("  " + response.value + "  - UV index low");
                     $("#uv-index").addClass(".noSun");
                    
               }
             
            });
}
    

   
    