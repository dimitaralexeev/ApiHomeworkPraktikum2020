$(document).ready(function(){
    //Global variables
    var tempResponseValue; //Store list of countries from the second request (by region)
    var tempCountriesList; //Store list of countries from the first request (all countries)
    var changeDisplayLayout;

    doApiRequestCountriesList();

    /**Do Api request for group of countries selected by region*/
    $('#search-countries').click(function(){
        tempResponseValue = null;
        $('#countries, #countries-list').empty();
        $('#switch').prop('disabled', false);
        $('#switch').bootstrapToggle('on');
        $('#choose-country').prop('selectedIndex',0);
        
        var population = [];

        $('input[name="population"]:checked').each(function(i){
            population.push($(this).val());
        });
        
        doApiRequest($('#select-region').val(), population);
    });

    /** Select one particular country from the list*/
    $('#choose-country').change(function(){
        tempResponseValue = null; 
        $('#countries, #countries-list').empty();
        $('#switch').bootstrapToggle('on');
        $('#switch').prop('disabled', true);

        postOneCountryInfo($('#choose-country').val(), true);
    });

    /** Change type of visualisation*/
    $('#switch').change(function(){
        if($(this).prop('checked')){
            changeDisplayLayout = true;
            $('#countries, #countries-list').empty();
            postCountries(tempResponseValue, changeDisplayLayout);
        }else{
            changeDisplayLayout = false;
            $('#countries, #countries-list').empty();
            postCountries(tempResponseValue, changeDisplayLayout);
        }
    });
    
    /** reset display information and buttons states*/
    $('#reset').click(function(){
        window.location.replace("file:///D:/praktikum-2020/ApiHomeworkPraktikum2020/index.html");
    });
    
    function doApiRequestCountriesList(){
        $.ajax({
            method:"GET",
            url:"https://restcountries.eu/rest/v2/all",
            dataType:"json"
        }).done(function(data){
            initCountriesList(data);
        }).fail(function(){
            $('#box').hide();
            alert("Oops, something went wrong!!!");
        });
    }

    function doApiRequest(chosenRegion, arrayOfPopulation){
        var url = "";
        
        switch (chosenRegion) {
            case "all":
                url = "https://restcountries.eu/rest/v2/all"
                break;
            case "asia":
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
            case "africa":
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
            case "americas":
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
            case "europe": 
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
            case "oceania": 
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
            case "Polar": 
                url = "https://restcountries.eu/rest/v2/region/" + chosenRegion
                break;
        }
      
        $.ajax({
            method:"GET",
            url:url,
            dataType:"json"
        }).done(function(data){
            if(arrayOfPopulation.length > 0){
                postCountries(sortCountriesByPopulation(arrayOfPopulation, data), changeDisplayLayout);
            }else{
                postCountries(data, changeDisplayLayout);
            }
        }).fail(function(){
            $('#box').hide();
            alert("Oops, something went wrong!!!");
        });
    }

    function initCountriesList(countriesData){
        tempCountriesList = countriesData;
        for(i in tempCountriesList){
            var option = $('#option-clone').clone();
            option.attr('value', countriesData[i].alpha3Code);
            option.text(countriesData[i].name);
            
            $('#choose-country').append(option);
        }
    }

    /**Post info for group of countries */
    function postCountries(respondedValue, displayChange){ 
        tempResponseValue = respondedValue;

        if(displayChange == true){
            for(i in tempResponseValue){
                var html = $('#clone-box').clone();
                html.find('button').attr('id', tempResponseValue[i].alpha3Code);
                html.find('img').attr('src', compareToNull(tempResponseValue[i].flag));
                html.find('h3').text(compareToNull(tempResponseValue[i].name));
                html.find('#capital').text(compareToNull(tempResponseValue[i].capital));
                html.find('#region').text(compareToNull(tempResponseValue[i].region));
                html.find('#population').text(compareToNull(tempResponseValue[i].population).toLocaleString('bg-BG'));
                html.find('#area').text(compareToNull(tempResponseValue[i].area).toLocaleString('bg-BG')); 
                html.find('#currency').text(compareToNull(tempResponseValue[i].currencies).map(element => ' ' + element.name 
                    + ' (' + element.code + ', ' +element.symbol + ')'));

                html.find('button').click(function(){
                    console.log($(this).prop('id'));
                    postOneCountryInfo($(this).prop('id'), false); 
                });
                
                $('#countries').append(html);
                html.show();
                $('#box').show();
            } 
        }else{
            for(i in tempResponseValue){
                var html = $('#cloneListItem').clone();
                html.find('div').attr('id', tempResponseValue[i].alpha3Code);
                html.find('img').attr('src', compareToNull(tempResponseValue[i].flag));
                html.find('h4').text(compareToNull(tempResponseValue[i].name));
                html.find('#capital').text(compareToNull(tempResponseValue[i].capital));
                html.find('#population').text(compareToNull(tempResponseValue[i].population).toLocaleString('bg-BG'));
                html.find('#area').text(compareToNull(tempResponseValue[i].area).toLocaleString('bg-BG'));
                
                html.find('div').click(function(){
                    console.log($(this).prop('id'));
                    postOneCountryInfo($(this).prop('id'), false); 
                });

                $('#countries-list').append(html);
                html.show();
                $('#box').show();
            }
        }  
    }

    /** Post info for one country */
    function postOneCountryInfo(countryByAlpha3Code, param){
        var countryData = findCountryByAlpha3Code(countryByAlpha3Code);

        var html = $('#box-country').clone();
        html.find('img').attr('src', compareToNull(countryData.flag));
        html.find('h3').text(compareToNull(countryData.name)  
            + ' (' + compareToNull(countryData.nativeName) + ')' + ' (' + compareToNull(countryData.alpha3Code) + ')');
        html.find('#capital').text(compareToNull(countryData.capital));
        html.find('#callingCodes').text(compareToNull(countryData.callingCodes).map(element => '+' + element));
        html.find('#region').text(compareToNull(countryData.region));
        html.find('#subregion').text(compareToNull(countryData.subregion));
        html.find('#regionalBlocs').text(compareToNull(countryData.regionalBlocs).map(element => element.name));
        html.find('#population').text(compareToNull(countryData.population).toLocaleString('bg-BG'));
        html.find('#area').text(compareToNull(countryData.area).toLocaleString('bg-BG'));
        html.find('#currency').text(compareToNull(countryData.currencies).map(element => ' ' + element.name + ' (' + element.code + ', ' + element.symbol + ')'));
        html.find('#language').text(compareToNull(countryData.languages).map(element => ' ' + element.name + ' (' + element.nativeName + ')'));
        html.find('#topLevelDomain').text(compareToNull(countryData.topLevelDomain).map(element => ' ' + element));
        html.find('#timeZone').text(compareToNull(countryData.timezones).map(element => ' ' + element));

        var borderCountriesAlpha3Code = compareToNull(countryData.borders).map(element => element);
        var borderCountries = [];
        for(i in borderCountriesAlpha3Code){
            borderCountries.push(findCountryByAlpha3Code(borderCountriesAlpha3Code[i]));
        }
        
        html.find('#borders').text(compareToNull(borderCountries).map(element => ' ' + element.name));
            
        if(param == false){
            $('#box-country, .modal-body').empty();
            $('.modal-body').append(html);
            $('#countryModal').modal('show');
            html.show();
            console.log(countryByAlpha3Code)

        }else{
            $('#countries').append(html);
            html.show();
            $('#box').show();
            console.log(countryByAlpha3Code)
        }
    }
    
    function findCountryByAlpha3Code(alpha3CodeParam){
        var country = tempCountriesList.find(function(element){
            return element.alpha3Code === alpha3CodeParam;
        });
        return country;
    }

    function compareToNull(elementToCompare){
        if(elementToCompare === null || elementToCompare === "" || elementToCompare === []){return "unknown"}
        return elementToCompare;
    }

    /** Find countries with chosen population number and sort them ascendig*/
    function sortCountriesByPopulation(populationArray, respondedCountries){
        var generatedArray = [];
        
        for(i in populationArray){
            switch(populationArray[i]){
                case "100000":
                    for(j in respondedCountries){
                        if(populationArray[i] >= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
                case "1000000":
                    for(j in respondedCountries){
                        if("100000" <= respondedCountries[j].population && populationArray[i] >= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
                case "10000000":
                    for(j in respondedCountries){
                        if("1000000" <= respondedCountries[j].population && populationArray[i] >= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
                case "50000000":
                    for(j in respondedCountries){
                        if("10000000" <= respondedCountries[j].population && populationArray[i] >= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
                case "99999999":
                    for(j in respondedCountries){
                        if("50000000" <= respondedCountries[j].population && populationArray[i] >= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
                case "100000000":
                    for(j in respondedCountries){
                        if(populationArray[i] <= respondedCountries[j].population){
                            generatedArray.push(respondedCountries[j]);
                        }
                    }
                    break;
            }
        }
        
        var sortedArray = generatedArray.sort(function(a, b){
            return a.population - b.population;
        });

        return sortedArray;
    }
});



