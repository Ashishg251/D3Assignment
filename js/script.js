heading = new Array();
data = new Array();
var fs = require('fs');
var rl = require('readline').createInterface({
  input: require('fs').createReadStream('../data/WDI_Data.csv')
});
var c = fs.readFileSync('../json/countries.json');
country = JSON.parse(c);
c = fs.readFileSync('../json/continents.json');
continents = JSON.parse(c);
rl.on('line',function(line){
    var arr = line.split(',');
    if(arr[0]==="Country Name") {
      for(var i=0; i<arr.length; i++) {
        heading.push(arr[i]);
      }
    }
    if((arr[2]==="GDP (constant 2005 US$)" && country.indexOf(arr[0])>-1) || (arr[2]==="GDP growth (annual %)" && country.indexOf(arr[0])>-1) ||(arr[2]==="GDP per capita (constant 2005 US$)" && country.indexOf(arr[0])>-1) || (arr[2]==="GNI (constant 2005 US$)" && country.indexOf(arr[0])>-1) || (arr[2]==="GNI per capita (constant 2005 US$)" && country.indexOf(arr[0])>-1)) {
      data.push(arr);
    }
});
rl.on('close',function(){
    var LENGTH = data.length;
    stacked = new Array();
    India = new Array();
    gdp = new Object();
    gdpc = new Object();
    gni = new Object();
    gnic = new Object();
    row = new Array();
    gdpCont = new Array();
    for(var i=0; i<LENGTH; i++) {
      if(data[i][2]==="GDP (constant 2005 US$)") {
        if(isNaN(parseFloat(data[i][49]))) {
          continue;
        }
        gdp[data[i][0]]=parseFloat(data[i][49]);
      }
      else if(data[i][2]==="GNI (constant 2005 US$)") {
        if(isNaN(parseFloat(data[i][49]))) {
          continue;
        }
        gni[data[i][0]]=parseFloat(data[i][49]);
      }
      else if(data[i][2]==="GDP per capita (constant 2005 US$)") {
        if(isNaN(parseFloat(data[i][49]))) {
          continue;
        }
        gdpc[data[i][0]]=parseFloat(data[i][49]);
        gdpCont.push(data[i]);
      }
      else if(data[i][2]==="GNI per capita (constant 2005 US$)"){
        if(isNaN(parseFloat(data[i][49]))) {
          continue;
        }
        gnic[data[i][0]]=parseFloat(data[i][49]);
      }
      else if(data[i][0]==="India" && data[i][2]==="GDP growth (annual %)"){
        row = data[i];
      }
    }

    /*First requirement I: GDP and GNI constant 2005 of all countries in 2005 (Stacked bar chart)*/

    /*Sorting according to GDP: Converting object to array of objects to sort easily*/
    var sortableArray = new Array();
    for(key in gdp) {
        var temp = new Object();
        temp["key"] = key;
        temp["value"] = gdp[key];
        sortableArray.push(temp);
    }
    sortableArray.sort(function(a,b){return (b.value-a.value)});
    for(var i = 0; i<15; i++) {
        var temp = new Object();
        temp["name"]=sortableArray[i].key;
        temp["GDP"]=sortableArray[i].value;
        temp["GNI"]=gni[sortableArray[i].key];
        stacked.push(temp);
    }
    var jsonOne = JSON.stringify(stacked);
    fs.writeFile('../json/reqOne1.json',jsonOne,function(err){
      if(err){
        console.error(err);
      }

    });
    /*First requirement II: GDP and GNI per capita constant 2005 of all countries in 2005 (Stacked bar chart)*/

    /*Sorting according to GDP per capita: Converting object to array of objects to sort easily*/
    stacked = new Array();
    sortableArray = new Array();
    for(key in gdpc) {
        var temp = new Object();
        temp["key"] = key;
        temp["value"] = gdpc[key];
        sortableArray.push(temp);
    }
    sortableArray.sort(function(a,b){return (b.value-a.value)});
    for(var i = 0; i<15; i++) {
        var temp = new Object();
        temp["name"]=sortableArray[i].key;
        temp["GDP"]=sortableArray[i].value;
        temp["GNI"]=gnic[sortableArray[i].key];
        stacked.push(temp);
    }
    var jsonTwo = JSON.stringify(stacked);
    fs.writeFile('../json/reqOne2.json',jsonTwo,function(err){
      if(err){
        console.error(err);
      }

    });

    /*Second Requirement: Plotting the GDP growth of India over the period of time*/
    for(var i=4; i<60; i++) {
        if(isNaN(parseFloat(row[i]))) {
          continue;
        }
        var temp = new Object();
        temp["year"] = heading[i];
        temp["gdp"] = parseFloat(row[i]);
        India.push(temp);
    }
    var jsonThree = JSON.stringify(India);
    fs.writeFile('../json/reqTwo.json',jsonThree,function(err){
      if(err){
        console.error(err);
      }

    });

    /*Third Requirement: Plot the aggregated "GDP per capita (constant 2005 US$)" by continent, over the time period*/
    var len = gdpCont.length;
    CONTINENTS = new Object();
    CONTINENTS["ASIA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["ASIA"].push(0.0);
    }
    CONTINENTS["AFRICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["AFRICA"].push(0.0);
    }
    CONTINENTS["N_AMERICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["N_AMERICA"].push(0.0);
    }
    CONTINENTS["S_AMERICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["S_AMERICA"].push(0.0);
    }
    CONTINENTS["OCEANIA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["OCEANIA"].push(0.0);
    }
    CONTINENTS["EUROPE"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["EUROPE"].push(0.0);
    }
    for(var i=0; i<len; i++) {
        for(var j=4; j<60; j++) {
          if(isNaN(parseFloat(gdpCont[i][j]))){
            continue;
          }
          CONTINENTS[continents[gdpCont[i][0]]][j-4]+=parseFloat(gdpCont[i][j]);
        }
    }
    stacked = new Array();
    for(var i=4; i<60; i++) {
      var temp = new Object();
      temp["year"] = heading[i];
      for(key in CONTINENTS) {
        if(CONTINENTS[key][i-4]<=0) {
          temp[key]=0;
        }
        temp[key] = CONTINENTS[key][i-4];
      }
      stacked.push(temp);
    }
    var jsonFour = JSON.stringify(stacked);
    fs.writeFile('../json/reqThree.json',jsonFour,function(err){
      if(err){
        console.error(err);
      }

    });

});
