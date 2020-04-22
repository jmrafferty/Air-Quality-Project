var dateselector = d3.select(".date-selector")

function dostuff(){
	var date = dateselector.node().value
	//refreshdata()
	console.log("hey this works");
	map.remove();
	d3.select("body").append("div").attr("id", "map")
	refreshdata();
}

dateselector.on("change", dostuff)

//define some default values for color scale config using values for ozone
//these will be overwritten later using minimum and d_maximum measurement values reported each day
var d_min = 1
var d_midpt = 2
var d_max = 3

//this function iterates through portions of our json and reassigns d_max and d_min values
//these values will be used in our color scaling function
function getExtrema(arr, prop) {
    //define vars to hold max and min values
	var max = 0;
	var min = 0;
    //loop through the array.prop, check each element's value against our vars that hold extreme values
	for (var i=0 ; i<arr.length ; i++) {
        if (i == 0){d_max = arr[i][prop]
		}else{
			if(arr[i][prop] > d_max) {
			d_max = arr[i][prop]
			};
		};
		if (i == 0){d_min = arr[i][prop]
		}else{
			if(arr[i][prop] < d_min) {
			d_min = arr[i][prop]
			};
		};
    };
	d_midpt = (d_max + d_min)/2;
	return d_midpt;
	return d_max;
	return d_min;
	console.log(`Inside the function: d_min: ${d_min},d_max: ${d_max}, d_midpt: ${d_midpt}`)
};

//function that creates a green to yellow to red color scale
function colorthis(measurement) {
	
	M = parseFloat(measurement)
	//rgb to hex conversion function borrowed from https://campushippo.com/lessons/how-to-convert-rgb-colors-to-hexadecimal-with-javascript-78219fdb
	function rgbToHex(rgb){ 
		var hex = Number(rgb).toString(16);
		if (hex.length < 2) {
		   hex = "0" + hex;
		}
		return hex;
		};
	
	//map the measurement domain on the the RGB color range
	var	colorScale = d3.scaleLinear()
		.domain([d_min,d_max])
		.range([0,255]);
	
	//starting at (0,255,0); for values less than the midpoint we need to add the red channel until we get to (255,255,0)
	if(M < d_midpt){
		var red = Math.round(2 * colorScale(M))
		var green = 255
		var blue = 0
		var hexcolor = "#"+rgbToHex(red)+rgbToHex(green)+rgbToHex(blue)
		return hexcolor
	
	//for values greater than the midpoint we need to subtract from the green channel until we get to (255,0,0)
	} else {
		red = 255 
		green = (255-Math.round(colorScale(M)))
		blue = 0
		var hexcolor = "#"+rgbToHex(red)+rgbToHex(green)+rgbToHex(blue)
		return hexcolor
	};
};

//create a function to scale radii by extreme values
//this function will get called after getExtrema and will therefore inherit the values it depends on
function scaleRadii(measurement){
	
	var rad = ((((measurement - d_midpt)**2)**(0.5))/d_midpt)
	
	return rad
};



function refreshdata () {
	d3.json("../static/js/aqi.json",function(data) {
		
		//report the top N cities by pollutant standard, 10 by default
		var topNvar = 10;
		
		//here's an example of a data sample
		console.log(data[0].Data[0])
		
		//filter the json by pollutant since the json is actually a composite of 5 api calls for 5 different pollutants
		var array_CO = data[0].Data
		console.log(`array_CO: ${array_CO[0].date_local}`)
		var array_SO2 = data[1].Data
		//console.log(`array_SO2: ${array_SO2}`)
		var array_ozone = data[2].Data
		//console.log(`array_ozone: ${array_ozone}`)
		var array_PM10 = data[3].Data
		//console.log(`array_PM10: ${array_PM10}`)
		var array_PM25 = data[4].Data
		//console.log(`array_PM25: ${array_PM25}`)
		
		console.log(`Filtering by this date: ${dateselector.node().value}`)
		
		//create a filtering function that only returns date matching the date selected in the dropdown
		function filterDataByDate(sample){
			return (Date.parse(sample.date_local) == Date.parse(dateselector.node().value));
			};
			
		//filter the pollutant data arrays by date using our filter function
		var array_CO_date = array_CO.filter(filterDataByDate)	
		var array_SO2_date = array_SO2.filter(filterDataByDate)	
		var array_ozone_date = array_ozone.filter(filterDataByDate)		
		var array_PM10_date = array_PM10.filter(filterDataByDate)	
		var array_PM25_date = array_PM25.filter(filterDataByDate)
		
		
		//filter each array by its respective pollutant standard
		//filter array_CO_date again by pollutant standard (e.g CO 1-hour 1971)
		var array_CO_date_standard = array_CO_date.filter(function CO_filter(sample){
			return (sample.pollutant_standard == "CO 1-hour 1971")
		});
		
		//filter array_SO2_date again by pollutant standard (e.g SO2 1-hour 1971)
		var array_SO2_date_standard = array_SO2_date.filter(function SO2_filter(sample){
			return (sample.pollutant_standard == "SO2 24-hour 1971")
		});
		
		//filter array_ozone_date again by pollutant standard (e.g ozone 1-hour 1971)
		var array_ozone_date_standard = array_ozone_date.filter(function ozone_filter(sample){
			return (sample.pollutant_standard == "Ozone 8-hour 2015")
		});
		
		//filter array_PM10_date again by pollutant standard (e.g PM10 1-hour 1971)
		var array_PM10_date_standard = array_PM10_date.filter(function PM10_filter(sample){
			return (sample.pollutant_standard == "PM10 24-hour 2006")
		});
		
		//filter array_PM25_date again by pollutant standard (e.g PM25 1-hour 1971)
		var array_PM25_date_standard = array_PM25_date.filter(function PM25_filter(sample){
			return (sample.pollutant_standard == "PM25 24-hour 2012")
		});
		
		console.log(`# Filtered CO data by date and standard: ${array_CO_date_standard.length}`)
		console.log(`# Filtered SO2 data by date: ${array_SO2_date_standard.length}`)
		console.log(`# Filtered ozone data by date: ${array_ozone_date_standard.length}`)
		console.log(`# Filtered PM10 data by date: ${array_PM10_date_standard.length}`)
		console.log(`# Filtered PM25 data by date: ${array_PM25_date_standard.length}`)
		
		//sort the filtered CO data low to high
		array_CO_filtered_sorted_asc = [].slice.call(array_CO_date_standard).sort(function(a,b){
			return (a.arithmetic_mean - b.arithmetic_mean)});
		
		//sort the filtered SO2 data low to high
		array_SO2_filtered_sorted_asc = [].slice.call(array_SO2_date_standard).sort(function(a,b){
			return (a.arithmetic_mean - b.arithmetic_mean)});
		
		//sort the filtered ozone data low to high
		array_ozone_filtered_sorted_asc = [].slice.call(array_ozone_date_standard).sort(function(a,b){
			return (a.arithmetic_mean - b.arithmetic_mean)});
		
		//sort the filtered PM10 data low to high
		array_PM10_filtered_sorted_asc = [].slice.call(array_PM10_date_standard).sort(function(a,b){
			return (a.arithmetic_mean - b.arithmetic_mean)});
		
		//sort the filtered PM25 data low to high
		array_PM25_filtered_sorted_asc = [].slice.call(array_PM25_date_standard).sort(function(a,b){
			return (a.arithmetic_mean - b.arithmetic_mean)});
			
		//sort the filtered CO data high to low
		array_CO_filtered_sorted_desc = [].slice.call(array_CO_date_standard).sort(function(a,b){
			return (b.arithmetic_mean - a.arithmetic_mean)});
		
		//sort the filtered SO2 data high to low
		array_SO2_filtered_sorted_desc = [].slice.call(array_SO2_date_standard).sort(function(a,b){
			return (b.arithmetic_mean - a.arithmetic_mean)});
		
		//sort the filtered ozone data high to low
		array_ozone_filtered_sorted_desc = [].slice.call(array_ozone_date_standard).sort(function(a,b){
			return (b.arithmetic_mean - a.arithmetic_mean)});
		
		//sort the filtered PM10 data high to low
		array_PM10_filtered_sorted_desc = [].slice.call(array_PM10_date_standard).sort(function(a,b){
			return (b.arithmetic_mean - a.arithmetic_mean)});
		
		//sort the filtered PM25 data high to low
		array_PM25_filtered_sorted_desc = [].slice.call(array_PM25_date_standard).sort(function(a,b){
			return (b.arithmetic_mean - a.arithmetic_mean)});
		
		
		//rank and report the filtered CO data
		var best_CO_date_list_measurements = [];
		var best_CO_date_list_CBSAs = [];
		var best_CO_date_list_cities = [];
		var best_CO_date_list_sampletype = [];
		var best_CO_date_list_site = [];
		var best_CO_date_list_lats = [];
		var best_CO_date_list_longs = [];
		
		var worst_CO_date_list_measurements = [];
		var worst_CO_date_list_CBSAs = [];
		var worst_CO_date_list_cities = [];
		var worst_CO_date_list_sampletype = [];
		var worst_CO_date_list_site = [];
		var worst_CO_date_list_lats = [];
		var worst_CO_date_list_longs = [];
		
		var count = 0;
		for (l = 0; l < array_CO_filtered_sorted_asc.length; l++){
			while (count <topNvar){
				if (best_CO_date_list_CBSAs.includes(array_CO_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_CO_date_list_measurements.push(array_CO_filtered_sorted_asc[l].arithmetic_mean);
					best_CO_date_list_cities.push(array_CO_filtered_sorted_asc[l].city);
					best_CO_date_list_CBSAs.push(array_CO_filtered_sorted_asc[l].cbsa);
					best_CO_date_list_sampletype.push(array_CO_filtered_sorted_asc[l].pollutant_standard);
					best_CO_date_list_site.push(array_CO_filtered_sorted_asc[l].site_address);
					best_CO_date_list_lats.push(array_CO_filtered_sorted_asc[l].latitude);
					best_CO_date_list_longs.push(array_CO_filtered_sorted_asc[l].longitude);
				};
			};
		};
		
		console.log(`Best CO Measurement Values: ${best_CO_date_list_measurements}`)
		console.log(`Best CO cities: ${best_CO_date_list_cities}`)
		console.log(`Best CO cbsas: ${best_CO_date_list_CBSAs}`)
		console.log(`Best CO sampletypes: ${best_CO_date_list_sampletype}`)
		console.log(`Best CO siteaddresses: ${best_CO_date_list_site}`)
		console.log(`Best CO lats: ${best_CO_date_list_lats}`)
		console.log(`Best CO longs: ${best_CO_date_list_longs}`)
		
		var count = 0;
		for (l = 0; l < array_CO_filtered_sorted_desc.length; l++){
			while (count <topNvar){
				if (worst_CO_date_list_CBSAs.includes(array_CO_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_CO_date_list_measurements.push(array_CO_filtered_sorted_desc[l].arithmetic_mean);
					worst_CO_date_list_cities.push(array_CO_filtered_sorted_desc[l].city);
					worst_CO_date_list_CBSAs.push(array_CO_filtered_sorted_desc[l].cbsa);
					worst_CO_date_list_sampletype.push(array_CO_filtered_sorted_desc[l].pollutant_standard);
					worst_CO_date_list_site.push(array_CO_filtered_sorted_desc[l].site_address);
					worst_CO_date_list_lats.push(array_CO_filtered_sorted_desc[l].latitude);
					worst_CO_date_list_longs.push(array_CO_filtered_sorted_desc[l].longitude);
				};
			};
		};
		
		console.log(`Worst CO Measurement Values: ${worst_CO_date_list_measurements}`)
		console.log(`Worst CO cities: ${worst_CO_date_list_cities}`)
		console.log(`Worst CO cbsas: ${worst_CO_date_list_CBSAs}`)
		console.log(`Worst CO sampletypes: ${worst_CO_date_list_sampletype}`)
		console.log(`Worst CO siteaddresses: ${worst_CO_date_list_site}`)
		console.log(`Worst CO lats: ${worst_CO_date_list_lats}`)
		console.log(`Worst CO longs: ${worst_CO_date_list_longs}`)
		
		//rank and report the filtered SO2 data
		var best_SO2_date_list_measurements = [];
		var best_SO2_date_list_CBSAs = [];
		var best_SO2_date_list_cities = [];
		var best_SO2_date_list_sampletype = [];
		var best_SO2_date_list_site = [];
		var best_SO2_date_list_lats = [];
		var best_SO2_date_list_longs = [];
		
		var worst_SO2_date_list_measurements = [];
		var worst_SO2_date_list_CBSAs = [];
		var worst_SO2_date_list_cities = [];
		var worst_SO2_date_list_sampletype = [];
		var worst_SO2_date_list_site = [];
		var worst_SO2_date_list_lats = [];
		var worst_SO2_date_list_longs = [];
		
		var count = 0;
		for (l = 0; l < array_SO2_filtered_sorted_asc.length; l++){
			while (count <topNvar){
				if (best_SO2_date_list_CBSAs.includes(array_SO2_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_SO2_date_list_measurements.push(array_SO2_filtered_sorted_asc[l].arithmetic_mean);
					best_SO2_date_list_cities.push(array_SO2_filtered_sorted_asc[l].city);
					best_SO2_date_list_CBSAs.push(array_SO2_filtered_sorted_asc[l].cbsa);
					best_SO2_date_list_sampletype.push(array_SO2_filtered_sorted_asc[l].pollutant_standard);
					best_SO2_date_list_site.push(array_SO2_filtered_sorted_asc[l].site_address);
					best_SO2_date_list_lats.push(array_SO2_filtered_sorted_asc[l].latitude);
					best_SO2_date_list_longs.push(array_SO2_filtered_sorted_asc[l].longitude);
				};
			};
		};
		
		console.log(`Best SO2 Measurement Values: ${best_SO2_date_list_measurements}`)
		console.log(`Best SO2 cities: ${best_SO2_date_list_cities}`)
		console.log(`Best SO2 cbsas: ${best_SO2_date_list_CBSAs}`)
		console.log(`Best SO2 sampletypes: ${best_SO2_date_list_sampletype}`)
		console.log(`Best SO2 siteaddresses: ${best_SO2_date_list_site}`)
		console.log(`Best SO2 lats: ${best_SO2_date_list_lats}`)
		console.log(`Best SO2 longs: ${best_SO2_date_list_longs}`)
		
		var count = 0;
		for (l = 0; l < array_SO2_filtered_sorted_desc.length; l++){
			while (count <topNvar){
				if (worst_SO2_date_list_CBSAs.includes(array_SO2_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_SO2_date_list_measurements.push(array_SO2_filtered_sorted_desc[l].arithmetic_mean);
					worst_SO2_date_list_cities.push(array_SO2_filtered_sorted_desc[l].city);
					worst_SO2_date_list_CBSAs.push(array_SO2_filtered_sorted_desc[l].cbsa);
					worst_SO2_date_list_sampletype.push(array_SO2_filtered_sorted_desc[l].pollutant_standard);
					worst_SO2_date_list_site.push(array_SO2_filtered_sorted_desc[l].site_address);
					worst_SO2_date_list_lats.push(array_SO2_filtered_sorted_desc[l].latitude);
					worst_SO2_date_list_longs.push(array_SO2_filtered_sorted_desc[l].longitude);
				};
			};
		};
		
		console.log(`Worst SO2 Measurement Values: ${worst_SO2_date_list_measurements}`)
		console.log(`Worst SO2 cities: ${worst_SO2_date_list_cities}`)
		console.log(`Worst SO2 cbsas: ${worst_SO2_date_list_CBSAs}`)
		console.log(`Worst SO2 sampletypes: ${worst_SO2_date_list_sampletype}`)
		console.log(`Worst SO2 siteaddresses: ${worst_SO2_date_list_site}`)
		console.log(`Worst SO2 lats: ${worst_SO2_date_list_lats}`)
		console.log(`Worst SO2 longs: ${worst_SO2_date_list_longs}`)
		
		//rank and report the filtered ozone data
		var best_ozone_date_list_measurements = [];
		var best_ozone_date_list_CBSAs = [];
		var best_ozone_date_list_cities = [];
		var best_ozone_date_list_sampletype = [];
		var best_ozone_date_list_site = [];
		var best_ozone_date_list_lats = [];
		var best_ozone_date_list_longs = [];
		
		var worst_ozone_date_list_measurements = [];
		var worst_ozone_date_list_CBSAs = [];
		var worst_ozone_date_list_cities = [];
		var worst_ozone_date_list_sampletype = [];
		var worst_ozone_date_list_site = [];
		var worst_ozone_date_list_lats = [];
		var worst_ozone_date_list_longs = [];
		
		var count = 0;
		for (l = 0; l < array_ozone_filtered_sorted_asc.length; l++){
			while (count <topNvar){
				if (best_ozone_date_list_CBSAs.includes(array_ozone_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_ozone_date_list_measurements.push(array_ozone_filtered_sorted_asc[l].arithmetic_mean);
					best_ozone_date_list_cities.push(array_ozone_filtered_sorted_asc[l].city);
					best_ozone_date_list_CBSAs.push(array_ozone_filtered_sorted_asc[l].cbsa);
					best_ozone_date_list_sampletype.push(array_ozone_filtered_sorted_asc[l].pollutant_standard);
					best_ozone_date_list_site.push(array_ozone_filtered_sorted_asc[l].site_address);
					best_ozone_date_list_lats.push(array_ozone_filtered_sorted_asc[l].latitude);
					best_ozone_date_list_longs.push(array_ozone_filtered_sorted_asc[l].longitude);
				};
			};
		};
		
		console.log(`Best ozone Measurement Values: ${best_ozone_date_list_measurements}`)
		console.log(`Best ozone cities: ${best_ozone_date_list_cities}`)
		console.log(`Best ozone cbsas: ${best_ozone_date_list_CBSAs}`)
		console.log(`Best ozone sampletypes: ${best_ozone_date_list_sampletype}`)
		console.log(`Best ozone siteaddresses: ${best_ozone_date_list_site}`)
		console.log(`Best ozone lats: ${best_ozone_date_list_lats}`)
		console.log(`Best ozone longs: ${best_ozone_date_list_longs}`)
		
		var count = 0;
		for (l = 0; l < array_ozone_filtered_sorted_desc.length; l++){
			while (count <topNvar){
				if (worst_ozone_date_list_CBSAs.includes(array_ozone_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_ozone_date_list_measurements.push(array_ozone_filtered_sorted_desc[l].arithmetic_mean);
					worst_ozone_date_list_cities.push(array_ozone_filtered_sorted_desc[l].city);
					worst_ozone_date_list_CBSAs.push(array_ozone_filtered_sorted_desc[l].cbsa);
					worst_ozone_date_list_sampletype.push(array_ozone_filtered_sorted_desc[l].pollutant_standard);
					worst_ozone_date_list_site.push(array_ozone_filtered_sorted_desc[l].site_address);
					worst_ozone_date_list_lats.push(array_ozone_filtered_sorted_desc[l].latitude);
					worst_ozone_date_list_longs.push(array_ozone_filtered_sorted_desc[l].longitude);
				};
			};
		};
		
		console.log(`Worst ozone Measurement Values: ${worst_ozone_date_list_measurements}`)
		console.log(`Worst ozone cities: ${worst_ozone_date_list_cities}`)
		console.log(`Worst ozone cbsas: ${worst_ozone_date_list_CBSAs}`)
		console.log(`Worst ozone sampletypes: ${worst_ozone_date_list_sampletype}`)
		console.log(`Worst ozone siteaddresses: ${worst_ozone_date_list_site}`)
		console.log(`Worst ozone lats: ${worst_ozone_date_list_lats}`)
		console.log(`Worst ozone longs: ${worst_ozone_date_list_longs}`)
		
		//rank and report the filtered PM2.5 data
		var best_PM25_date_list_measurements = [];
		var best_PM25_date_list_CBSAs = [];
		var best_PM25_date_list_cities = [];
		var best_PM25_date_list_sampletype = [];
		var best_PM25_date_list_site = [];
		var best_PM25_date_list_lats = [];
		var best_PM25_date_list_longs = [];
		
		var worst_PM25_date_list_measurements = [];
		var worst_PM25_date_list_CBSAs = [];
		var worst_PM25_date_list_cities = [];
		var worst_PM25_date_list_sampletype = [];
		var worst_PM25_date_list_site = [];
		var worst_PM25_date_list_lats = [];
		var worst_PM25_date_list_longs = [];
		
		var count = 0;
		for (l = 0; l < array_PM25_filtered_sorted_asc.length; l++){
			while (count <topNvar){
				if (best_PM25_date_list_CBSAs.includes(array_PM25_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_PM25_date_list_measurements.push(array_PM25_filtered_sorted_asc[l].arithmetic_mean);
					best_PM25_date_list_cities.push(array_PM25_filtered_sorted_asc[l].city);
					best_PM25_date_list_CBSAs.push(array_PM25_filtered_sorted_asc[l].cbsa);
					best_PM25_date_list_sampletype.push(array_PM25_filtered_sorted_asc[l].pollutant_standard);
					best_PM25_date_list_site.push(array_PM25_filtered_sorted_asc[l].site_address);
					best_PM25_date_list_lats.push(array_PM25_filtered_sorted_asc[l].latitude);
					best_PM25_date_list_longs.push(array_PM25_filtered_sorted_asc[l].longitude);
				};
			};
		};
		
		console.log(`Best PM25 Measurement Values: ${best_PM25_date_list_measurements}`)
		console.log(`Best PM25 cities: ${best_PM25_date_list_cities}`)
		console.log(`Best PM25 cbsas: ${best_PM25_date_list_CBSAs}`)
		console.log(`Best PM25 sampletypes: ${best_PM25_date_list_sampletype}`)
		console.log(`Best PM25 siteaddresses: ${best_PM25_date_list_site}`)
		console.log(`Best PM25 lats: ${best_PM25_date_list_lats}`)
		console.log(`Best PM25 longs: ${best_PM25_date_list_longs}`)
		
		var count = 0;
		for (l = 0; l < array_PM25_filtered_sorted_desc.length; l++){
			while (count <topNvar){
				if (worst_PM25_date_list_CBSAs.includes(array_PM25_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_PM25_date_list_measurements.push(array_PM25_filtered_sorted_desc[l].arithmetic_mean);
					worst_PM25_date_list_cities.push(array_PM25_filtered_sorted_desc[l].city);
					worst_PM25_date_list_CBSAs.push(array_PM25_filtered_sorted_desc[l].cbsa);
					worst_PM25_date_list_sampletype.push(array_PM25_filtered_sorted_desc[l].pollutant_standard);
					worst_PM25_date_list_site.push(array_PM25_filtered_sorted_desc[l].site_address);
					worst_PM25_date_list_lats.push(array_PM25_filtered_sorted_desc[l].latitude);
					worst_PM25_date_list_longs.push(array_PM25_filtered_sorted_desc[l].longitude);
				};
			};
		};
		
		console.log(`Worst PM25 Measurement Values: ${worst_PM25_date_list_measurements}`)
		console.log(`Worst PM25 cities: ${worst_PM25_date_list_cities}`)
		console.log(`Worst PM25 cbsas: ${worst_PM25_date_list_CBSAs}`)
		console.log(`Worst PM25 sampletypes: ${worst_PM25_date_list_sampletype}`)
		console.log(`Worst PM25 siteaddresses: ${worst_PM25_date_list_site}`)
		console.log(`Worst PM25 lats: ${worst_PM25_date_list_lats}`)
		console.log(`Worst PM25 longs: ${worst_PM25_date_list_longs}`)
		
		//rank and report the filtered PM1.0 data
		var best_PM10_date_list_measurements = [];
		var best_PM10_date_list_CBSAs = [];
		var best_PM10_date_list_cities = [];
		var best_PM10_date_list_sampletype = [];
		var best_PM10_date_list_site = [];
		var best_PM10_date_list_lats = [];
		var best_PM10_date_list_longs = [];
		
		var worst_PM10_date_list_measurements = [];
		var worst_PM10_date_list_CBSAs = [];
		var worst_PM10_date_list_cities = [];
		var worst_PM10_date_list_sampletype = [];
		var worst_PM10_date_list_site = [];
		var worst_PM10_date_list_lats = [];
		var worst_PM10_date_list_longs = [];
		
		var count = 0;
		for (l = 0; l < array_PM10_filtered_sorted_asc.length; l++){
			while (count <topNvar){
				if (best_PM10_date_list_CBSAs.includes(array_PM10_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_PM10_date_list_measurements.push(array_PM10_filtered_sorted_asc[l].arithmetic_mean);
					best_PM10_date_list_cities.push(array_PM10_filtered_sorted_asc[l].city);
					best_PM10_date_list_CBSAs.push(array_PM10_filtered_sorted_asc[l].cbsa);
					best_PM10_date_list_sampletype.push(array_PM10_filtered_sorted_asc[l].pollutant_standard);
					best_PM10_date_list_site.push(array_PM10_filtered_sorted_asc[l].site_address);
					best_PM10_date_list_lats.push(array_PM10_filtered_sorted_asc[l].latitude);
					best_PM10_date_list_longs.push(array_PM10_filtered_sorted_asc[l].longitude);
				};
			};
		};
		
		console.log(`Best PM10 Measurement Values: ${best_PM10_date_list_measurements}`)
		console.log(`Best PM10 cities: ${best_PM10_date_list_cities}`)
		console.log(`Best PM10 cbsas: ${best_PM10_date_list_CBSAs}`)
		console.log(`Best PM10 sampletypes: ${best_PM10_date_list_sampletype}`)
		console.log(`Best PM10 siteaddresses: ${best_PM10_date_list_site}`)
		console.log(`Best PM10 lats: ${best_PM10_date_list_lats}`)
		console.log(`Best PM10 longs: ${best_PM10_date_list_longs}`)
		
		var count = 0;
		for (l = 0; l < array_PM10_filtered_sorted_desc.length; l++){
			while (count <topNvar){
				if (worst_PM10_date_list_CBSAs.includes(array_PM10_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_PM10_date_list_measurements.push(array_PM10_filtered_sorted_desc[l].arithmetic_mean);
					worst_PM10_date_list_cities.push(array_PM10_filtered_sorted_desc[l].city);
					worst_PM10_date_list_CBSAs.push(array_PM10_filtered_sorted_desc[l].cbsa);
					worst_PM10_date_list_sampletype.push(array_PM10_filtered_sorted_desc[l].pollutant_standard);
					worst_PM10_date_list_site.push(array_PM10_filtered_sorted_desc[l].site_address);
					worst_PM10_date_list_lats.push(array_PM10_filtered_sorted_desc[l].latitude);
					worst_PM10_date_list_longs.push(array_PM10_filtered_sorted_desc[l].longitude);
				};
			};
		};
		
		console.log(`Worst PM10 Measurement Values: ${worst_PM10_date_list_measurements}`)
		console.log(`Worst PM10 cities: ${worst_PM10_date_list_cities}`)
		console.log(`Worst PM10 cbsas: ${worst_PM10_date_list_CBSAs}`)
		console.log(`Worst PM10 sampletypes: ${worst_PM10_date_list_sampletype}`)
		console.log(`Worst PM10 siteaddresses: ${worst_PM10_date_list_site}`)
		console.log(`Worst PM10 lats: ${worst_PM10_date_list_lats}`)
		console.log(`Worst PM10 longs: ${worst_PM10_date_list_longs}`)
				
		//call our function to retrieve the 
		getExtrema(array_ozone_filtered_sorted_asc,"arithmetic_mean")
		
		var allozonemarkers = [];
		for (var i = 0; i<array_ozone_filtered_sorted_asc.length; i++) {
			var rank = i + 1
			var nth = array_ozone_filtered_sorted_asc[i]
			var popuptext = ("<b>Rank:</b> " +rank+ "<hr>"
				+"<b>City:</b> " + nth.cbsa + "<hr>"
				+ "<b>Measurement:</b> " + nth.arithmetic_mean)
			
			//Add a new marker and bind a pop-up
			allozonemarkers.push(L.circleMarker([nth.latitude, 
					nth.longitude], 
					{title: `City: ${nth.cbsa}`
					,stroke: false,
						fillOpacity: 0.5,
						radius: scaleRadii(nth.arithmetic_mean)*100,
						fillColor: colorthis(nth.arithmetic_mean)})
					.bindPopup(popuptext)
			);
		};
		
		//call our function to retrieve the 
		getExtrema(array_PM25_filtered_sorted_asc,"arithmetic_mean")
		
		var allPM25markers = [];
		for (var i = 0; i<array_PM25_filtered_sorted_asc.length; i++) {
			var rank = i + 1
			var nth = array_PM25_filtered_sorted_asc[i]
			var popuptext = ("<b>Rank:</b> " +rank+ "<hr>"
				+"<b>City:</b> " + nth.cbsa + "<hr>"
				+ "<b>Measurement:</b> " + nth.arithmetic_mean)
			
			//Add a new marker and bind a pop-up
			allPM25markers.push(L.circleMarker([nth.latitude, 
					nth.longitude], 
					{title: `City: ${nth.cbsa}`
					,stroke: false,
						fillOpacity: 0.5,
						radius: scaleRadii(nth.arithmetic_mean)*40,
						fillColor: colorthis(nth.arithmetic_mean)})
					.bindPopup(popuptext)
			);
		};
		
		//call our function to retrieve the 
		getExtrema(array_PM10_filtered_sorted_asc,"arithmetic_mean")
		
		var allPM10markers = [];
		for (var i = 0; i<array_PM10_filtered_sorted_asc.length; i++) {
			var rank = i + 1
			var nth = array_PM10_filtered_sorted_asc[i]
			var popuptext = ("<b>Rank:</b> " +rank+ "<hr>"
				+"<b>City:</b> " + nth.cbsa + "<hr>"
				+ "<b>Measurement:</b> " + nth.arithmetic_mean)
			
			//Add a new marker and bind a pop-up
			allPM10markers.push(L.circleMarker([nth.latitude, 
					nth.longitude], 
					{title: `City: ${nth.cbsa}`
					,stroke: false,
						fillOpacity: 0.5,
						radius: scaleRadii(nth.arithmetic_mean)*40,
						fillColor: colorthis(nth.arithmetic_mean)})
					.bindPopup(popuptext)
			);
		};
		
		//plotting things starts here
		
		var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			d_d_maxZoom: 18,
			id: "mapbox.light",
			accessToken: API_KEY
			});
		
		var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			d_d_maxZoom: 18,
			id: "mapbox.dark",
			accessToken: API_KEY
			});
		
		//establish map background types
		var baseMaps = {
			Light: light,
			Dark: dark,
			};
		
		var all_ozone_markers = L.layerGroup(allozonemarkers)
		var all_PM25_markers = L.layerGroup(allPM25markers)
		var all_PM10_markers = L.layerGroup(allPM10markers)
		
		var overlaymaps = {
			"Ozone" : all_ozone_markers,
			"PM-2.5" : all_PM25_markers,
			"PM-10": all_PM10_markers
		};
		
						
		//add the map, set default layers
		var myMap = L.map("map", {
			center: [28, -95.95],
			zoom: 4,
			layers: [light,all_ozone_markers] //,oz_good,oz_bad
			});
			
		// Pass our map layers into our layer control
		// Add the layer control to the map
		L.control.layers(baseMaps, overlaymaps,{collapsed: false}).addTo(myMap);

	});
	
};

function getdatelist (){
	d3.json("../static/js/aqi.json",function(data) {
			var test = data[0].Data
			
			var datelist = [];
			
			for (var i = 0; i < data[0].Data.length; i++) {
				datelist.push(Date.parse(data[0].Data[i].date_local))
			};
			
			var sorted = datelist.sort(function(a,b){
				return (b - a)
				});
			
			var lastdate = sorted[0]
			var firstdate = sorted[sorted.length-1]+86400000
			
			console.log(`First date in dataset: ${moment(firstdate).format("YYYY-MM-DD")}`)
			console.log(`Last date in dataset: ${moment(lastdate).format("YYYY-MM-DD")}`)
			
			sortedunique = []; 
			for (j = 0; j < sorted.length; j++) {
				if (!sortedunique.includes(moment(sorted[j]).format("YYYY-MM-DD"))) {
					var temp = sorted[j]
					var temp2 = moment(temp).format("YYYY-MM-DD")
					sortedunique.push(temp2)
				};
			};
			console.log(sortedunique)
	
	dateselector.html("")
	for (var k = 0; k < (sortedunique.length-1); k++){
		dateselector.append("option").text(sortedunique[k])
		};
	
	});

};
getdatelist();



//date = "2020-04-14"
refreshdata();