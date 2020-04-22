var dateselector = d3.select(".date-selector");
console.log(dateselector.node().value);

//###################################################################################
var paramselector = d3.select(".param-selector")
var paramdescription = d3.select("#param-describe")

//###################################################################################


function dostuff(){
	//var date = dateselector.node().value
	//refreshdata()
	console.log("hey this works");
	//map.clear();
	
	//d3.select("body").append("div").attr("id", "map");
	refreshdata();
}


dateselector.on("change", dostuff)

//###################################################################################
paramselector.on("change", dostuff)
//###################################################################################


function refreshdata () {

	

	d3.json("../static/js/aqi.json",function(data) {
		
		console.log(data)
		var payload = data[0].Data[0]
		console.log(payload)
		
		//filter by pollutant
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
		
		var worst_CO_date_list_measurements = [];
		var worst_CO_date_list_CBSAs = [];
		var worst_CO_date_list_cities = [];
		var worst_CO_date_list_sampletype = [];
		var worst_CO_date_list_site = [];
		
		var count = 0;
		for (l = 0; l < array_CO_filtered_sorted_asc.length; l++){
			while (count <10){
				if (best_CO_date_list_CBSAs.includes(array_CO_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_CO_date_list_measurements.push(array_CO_filtered_sorted_asc[l].arithmetic_mean);
					best_CO_date_list_cities.push(array_CO_filtered_sorted_asc[l].city);
					best_CO_date_list_CBSAs.push(array_CO_filtered_sorted_asc[l].cbsa);
					best_CO_date_list_sampletype.push(array_CO_filtered_sorted_asc[l].pollutant_standard);
					best_CO_date_list_site.push(array_CO_filtered_sorted_asc[l].site_address);
				};
			};
		};
		
		console.log(`Best CO Measurement Values: ${best_CO_date_list_measurements}`)
		console.log(`Best CO cities: ${best_CO_date_list_cities}`)
		console.log(`Best CO cbsas: ${best_CO_date_list_CBSAs}`)
		console.log(`Best CO sampletypes: ${best_CO_date_list_sampletype}`)
		console.log(`Best CO siteaddresses: ${best_CO_date_list_site}`)
		
		var count = 0;
		for (l = 0; l < array_CO_filtered_sorted_desc.length; l++){
			while (count <10){
				if (worst_CO_date_list_CBSAs.includes(array_CO_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_CO_date_list_measurements.push(array_CO_filtered_sorted_desc[l].arithmetic_mean);
					worst_CO_date_list_cities.push(array_CO_filtered_sorted_desc[l].city);
					worst_CO_date_list_CBSAs.push(array_CO_filtered_sorted_desc[l].cbsa);
					worst_CO_date_list_sampletype.push(array_CO_filtered_sorted_desc[l].pollutant_standard);
					worst_CO_date_list_site.push(array_CO_filtered_sorted_desc[l].site_address);
				};
			};
		};
		
		console.log(`Worst CO Measurement Values: ${worst_CO_date_list_measurements}`)
		console.log(`Worst CO cities: ${worst_CO_date_list_cities}`)
		console.log(`Worst CO cbsas: ${worst_CO_date_list_CBSAs}`)
		console.log(`Worst CO sampletypes: ${worst_CO_date_list_sampletype}`)
		console.log(`Worst CO siteaddresses: ${worst_CO_date_list_site}`)
		
		//rank and report the filtered SO2 data
		var best_SO2_date_list_measurements = [];
		var best_SO2_date_list_CBSAs = [];
		var best_SO2_date_list_cities = [];
		var best_SO2_date_list_sampletype = [];
		var best_SO2_date_list_site = [];
		
		var worst_SO2_date_list_measurements = [];
		var worst_SO2_date_list_CBSAs = [];
		var worst_SO2_date_list_cities = [];
		var worst_SO2_date_list_sampletype = [];
		var worst_SO2_date_list_site = [];
		
		var count = 0;
		for (l = 0; l < array_SO2_filtered_sorted_asc.length; l++){
			while (count <10){
				if (best_SO2_date_list_CBSAs.includes(array_SO2_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_SO2_date_list_measurements.push(array_SO2_filtered_sorted_asc[l].arithmetic_mean);
					best_SO2_date_list_cities.push(array_SO2_filtered_sorted_asc[l].city);
					best_SO2_date_list_CBSAs.push(array_SO2_filtered_sorted_asc[l].cbsa);
					best_SO2_date_list_sampletype.push(array_SO2_filtered_sorted_asc[l].pollutant_standard);
					best_SO2_date_list_site.push(array_SO2_filtered_sorted_asc[l].site_address);
				};
			};
		};
		
		console.log(`Best SO2 Measurement Values: ${best_SO2_date_list_measurements}`)
		console.log(`Best SO2 cities: ${best_SO2_date_list_cities}`)
		console.log(`Best SO2 cbsas: ${best_SO2_date_list_CBSAs}`)
		console.log(`Best SO2 sampletypes: ${best_SO2_date_list_sampletype}`)
		console.log(`Best SO2 siteaddresses: ${best_SO2_date_list_site}`)
		
		var count = 0;
		for (l = 0; l < array_SO2_filtered_sorted_desc.length; l++){
			while (count <10){
				if (worst_SO2_date_list_CBSAs.includes(array_SO2_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_SO2_date_list_measurements.push(array_SO2_filtered_sorted_desc[l].arithmetic_mean);
					worst_SO2_date_list_cities.push(array_SO2_filtered_sorted_desc[l].city);
					worst_SO2_date_list_CBSAs.push(array_SO2_filtered_sorted_desc[l].cbsa);
					worst_SO2_date_list_sampletype.push(array_SO2_filtered_sorted_desc[l].pollutant_standard);
					worst_SO2_date_list_site.push(array_SO2_filtered_sorted_desc[l].site_address);
				};
			};
		};
		
		console.log(`Worst SO2 Measurement Values: ${worst_SO2_date_list_measurements}`)
		console.log(`Worst SO2 cities: ${worst_SO2_date_list_cities}`)
		console.log(`Worst SO2 cbsas: ${worst_SO2_date_list_CBSAs}`)
		console.log(`Worst SO2 sampletypes: ${worst_SO2_date_list_sampletype}`)
		console.log(`Worst SO2 siteaddresses: ${worst_SO2_date_list_site}`)
		
		//rank and report the filtered ozone data
		var best_ozone_date_list_measurements = [];
		var best_ozone_date_list_CBSAs = [];
		var best_ozone_date_list_cities = [];
		var best_ozone_date_list_sampletype = [];
		var best_ozone_date_list_site = [];
		
		var worst_ozone_date_list_measurements = [];
		var worst_ozone_date_list_CBSAs = [];
		var worst_ozone_date_list_cities = [];
		var worst_ozone_date_list_sampletype = [];
		var worst_ozone_date_list_site = [];
		
		var count = 0;
		for (l = 0; l < array_ozone_filtered_sorted_asc.length; l++){
			while (count <10){
				if (best_ozone_date_list_CBSAs.includes(array_ozone_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_ozone_date_list_measurements.push(array_ozone_filtered_sorted_asc[l].arithmetic_mean);
					best_ozone_date_list_cities.push(array_ozone_filtered_sorted_asc[l].city);
					best_ozone_date_list_CBSAs.push(array_ozone_filtered_sorted_asc[l].cbsa);
					best_ozone_date_list_sampletype.push(array_ozone_filtered_sorted_asc[l].pollutant_standard);
					best_ozone_date_list_site.push(array_ozone_filtered_sorted_asc[l].site_address);
				};
			};
		};
		
		console.log(`Best ozone Measurement Values: ${best_ozone_date_list_measurements}`)
		console.log(`Best ozone cities: ${best_ozone_date_list_cities}`)
		console.log(`Best ozone cbsas: ${best_ozone_date_list_CBSAs}`)
		console.log(`Best ozone sampletypes: ${best_ozone_date_list_sampletype}`)
		console.log(`Best ozone siteaddresses: ${best_ozone_date_list_site}`)
		
		var count = 0;
		for (l = 0; l < array_ozone_filtered_sorted_desc.length; l++){
			while (count <10){
				if (worst_ozone_date_list_CBSAs.includes(array_ozone_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_ozone_date_list_measurements.push(array_ozone_filtered_sorted_desc[l].arithmetic_mean);
					worst_ozone_date_list_cities.push(array_ozone_filtered_sorted_desc[l].city);
					worst_ozone_date_list_CBSAs.push(array_ozone_filtered_sorted_desc[l].cbsa);
					worst_ozone_date_list_sampletype.push(array_ozone_filtered_sorted_desc[l].pollutant_standard);
					worst_ozone_date_list_site.push(array_ozone_filtered_sorted_desc[l].site_address);
				};
			};
		};
		
		console.log(`Worst ozone Measurement Values: ${worst_ozone_date_list_measurements}`)
		console.log(`Worst ozone cities: ${worst_ozone_date_list_cities}`)
		console.log(`Worst ozone cbsas: ${worst_ozone_date_list_CBSAs}`)
		console.log(`Worst ozone sampletypes: ${worst_ozone_date_list_sampletype}`)
		console.log(`Worst ozone siteaddresses: ${worst_ozone_date_list_site}`)
		
		//rank and report the filtered PM10 data
		var best_PM10_date_list_measurements = [];
		var best_PM10_date_list_CBSAs = [];
		var best_PM10_date_list_cities = [];
		var best_PM10_date_list_sampletype = [];
		var best_PM10_date_list_site = [];
		
		var worst_PM10_date_list_measurements = [];
		var worst_PM10_date_list_CBSAs = [];
		var worst_PM10_date_list_cities = [];
		var worst_PM10_date_list_sampletype = [];
		var worst_PM10_date_list_site = [];
		
		var count = 0;
		for (l = 0; l < array_PM10_filtered_sorted_asc.length; l++){
			while (count <10){
				if (best_PM10_date_list_CBSAs.includes(array_PM10_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_PM10_date_list_measurements.push(array_PM10_filtered_sorted_asc[l].arithmetic_mean);
					best_PM10_date_list_cities.push(array_PM10_filtered_sorted_asc[l].city);
					best_PM10_date_list_CBSAs.push(array_PM10_filtered_sorted_asc[l].cbsa);
					best_PM10_date_list_sampletype.push(array_PM10_filtered_sorted_asc[l].pollutant_standard);
					best_PM10_date_list_site.push(array_PM10_filtered_sorted_asc[l].site_address);
				};
			};
		};
		
		console.log(`Best PM10 Measurement Values: ${best_PM10_date_list_measurements}`)
		console.log(`Best PM10 cities: ${best_PM10_date_list_cities}`)
		console.log(`Best PM10 cbsas: ${best_PM10_date_list_CBSAs}`)
		console.log(`Best PM10 sampletypes: ${best_PM10_date_list_sampletype}`)
		console.log(`Best PM10 siteaddresses: ${best_PM10_date_list_site}`)
		
		var count = 0;
		for (l = 0; l < array_PM10_filtered_sorted_desc.length; l++){
			while (count <10){
				if (worst_PM10_date_list_CBSAs.includes(array_PM10_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_PM10_date_list_measurements.push(array_PM10_filtered_sorted_desc[l].arithmetic_mean);
					worst_PM10_date_list_cities.push(array_PM10_filtered_sorted_desc[l].city);
					worst_PM10_date_list_CBSAs.push(array_PM10_filtered_sorted_desc[l].cbsa);
					worst_PM10_date_list_sampletype.push(array_PM10_filtered_sorted_desc[l].pollutant_standard);
					worst_PM10_date_list_site.push(array_PM10_filtered_sorted_desc[l].site_address);
				};
			};
		};
		
		console.log(`Worst PM10 Measurement Values: ${worst_PM10_date_list_measurements}`)
		console.log(`Worst PM10 cities: ${worst_PM10_date_list_cities}`)
		console.log(`Worst PM10 cbsas: ${worst_PM10_date_list_CBSAs}`)
		console.log(`Worst PM10 sampletypes: ${worst_PM10_date_list_sampletype}`)
		console.log(`Worst PM10 siteaddresses: ${worst_PM10_date_list_site}`)
		
		//rank and report the filtered PM25 data
		var best_PM25_date_list_measurements = [];
		var best_PM25_date_list_CBSAs = [];
		var best_PM25_date_list_cities = [];
		var best_PM25_date_list_sampletype = [];
		var best_PM25_date_list_site = [];
		
		var worst_PM25_date_list_measurements = [];
		var worst_PM25_date_list_CBSAs = [];
		var worst_PM25_date_list_cities = [];
		var worst_PM25_date_list_sampletype = [];
		var worst_PM25_date_list_site = [];
		
		var count = 0;
		for (l = 0; l < array_PM25_filtered_sorted_asc.length; l++){
			while (count <10){
				if (best_PM25_date_list_CBSAs.includes(array_PM25_filtered_sorted_asc[l].cbsa)){
				break;
				}else{
					count++
					best_PM25_date_list_measurements.push(array_PM25_filtered_sorted_asc[l].arithmetic_mean);
					best_PM25_date_list_cities.push(array_PM25_filtered_sorted_asc[l].city);
					best_PM25_date_list_CBSAs.push(array_PM25_filtered_sorted_asc[l].cbsa);
					best_PM25_date_list_sampletype.push(array_PM25_filtered_sorted_asc[l].pollutant_standard);
					best_PM25_date_list_site.push(array_PM25_filtered_sorted_asc[l].site_address);
				};
			};
		};
		
		console.log(`Best PM25 Measurement Values: ${best_PM25_date_list_measurements}`)
		console.log(`Best PM25 cities: ${best_PM25_date_list_cities}`)
		console.log(`Best PM25 cbsas: ${best_PM25_date_list_CBSAs}`)
		console.log(`Best PM25 sampletypes: ${best_PM25_date_list_sampletype}`)
		console.log(`Best PM25 siteaddresses: ${best_PM25_date_list_site}`)
		
		var count = 0;
		for (l = 0; l < array_PM25_filtered_sorted_desc.length; l++){
			while (count <10){
				if (worst_PM25_date_list_CBSAs.includes(array_PM25_filtered_sorted_desc[l].cbsa)){
				break;
				}else{
					count++
					worst_PM25_date_list_measurements.push(array_PM25_filtered_sorted_desc[l].arithmetic_mean);
					worst_PM25_date_list_cities.push(array_PM25_filtered_sorted_desc[l].city);
					worst_PM25_date_list_CBSAs.push(array_PM25_filtered_sorted_desc[l].cbsa);
					worst_PM25_date_list_sampletype.push(array_PM25_filtered_sorted_desc[l].pollutant_standard);
					worst_PM25_date_list_site.push(array_PM25_filtered_sorted_desc[l].site_address);
				};
			};
		};
		
		console.log(`Worst PM25 Measurement Values: ${worst_PM25_date_list_measurements}`)
		console.log(`Worst PM25 cities: ${worst_PM25_date_list_cities}`)
		console.log(`Worst PM25 cbsas: ${worst_PM25_date_list_CBSAs}`)
		console.log(`Worst PM25 sampletypes: ${worst_PM25_date_list_sampletype}`)
		console.log(`Worst PM25 siteaddresses: ${worst_PM25_date_list_site}`)

		console.log(worst_PM25_date_list_measurements);

		//###################################################################################
		
		if (paramselector.property("value") == "Carbon Monoxide (CO)") {
			xbest = best_CO_date_list_CBSAs;
			ybest = best_CO_date_list_measurements;
			xworst = worst_CO_date_list_CBSAs;
			yworst = worst_CO_date_list_measurements;
			yax = "CO reading (PPM)"
			paramdescription.text("CO is a colorless, odorless gas that can be harmful when inhaled in large amounts. CO is released when something is burned. The greatest sources of CO to outdoor air are cars, trucks and other vehicles or machinery that burn fossil fuels.");
		}
		else if (paramselector.property("value") == "Sulfur Dioxide (SO2)") {
			xbest = best_SO2_date_list_CBSAs;
			ybest = best_SO2_date_list_measurements;
			xworst = worst_SO2_date_list_CBSAs;
			yworst = worst_SO2_date_list_measurements;
			yax = "SO2 reading (PPB)"
			paramdescription.text("Short-term exposures to SO2 can harm the human respiratory system and make breathing difficult. People with asthma, particularly children, are sensitive to these effects of SO2.  The largest source of SO2 in the atmosphere is the burning of fossil fuels by power plants and other industrial facilities.");
		}
		else if (paramselector.property("value") == "Ozone (O3)") {
			xbest = best_ozone_date_list_CBSAs;
			ybest = best_ozone_date_list_measurements;
			xworst = worst_ozone_date_list_CBSAs;
			yworst = worst_ozone_date_list_measurements;
			yax = "Ozone reading (PPM)"
			paramdescription.text("Ozone can be “good” or “bad” for health and the environment depending on where it’s found in the atmosphere. Stratospheric ozone is “good” because it protects living things from ultraviolet radiation from the sun. Ground-level ozone, the topic of this website, is “bad” because it can trigger a variety of health problems, particularly for children, the elderly, and people of all ages who have lung diseases such as asthma.");
		}
		else if (paramselector.property("value") == "PM 2.5") {
			xbest = best_PM25_date_list_CBSAs;
			ybest = best_PM25_date_list_measurements;
			xworst = worst_PM25_date_list_CBSAs;
			yworst = worst_PM25_date_list_measurements;
			yax = "PM 2.5 reading (Micrograms/cubic meter)"
			paramdescription.text("PM stands for particulate matter (also called particle pollution): the term for a mixture of solid particles and liquid droplets found in the air.  PM 2.5 describes fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller.");
		}
		else if (paramselector.property("value") == "PM 10") {
			xbest = best_PM10_date_list_CBSAs;
			ybest = best_PM10_date_list_measurements;
			xworst = worst_PM10_date_list_CBSAs;
			yworst = worst_PM10_date_list_measurements;
			yax = "PM 10 reading (Micrograms/cubic meter)"
			paramdescription.text("PM stands for particulate matter (also called particle pollution): the term for a mixture of solid particles and liquid droplets found in the air.  PM 10 describes inhalable particles, with diameters that are generally 10 micrometers and smaller");
		}
		
		var trace1 = {
			x: xworst,
			y: yworst,
			type: "bar",
			marker: {
				color: "darkred"
			}
		  };
		  
		  var data1 = [trace1];
		  
		  var layout1 = {
			title: "Bottom 10 Cities",
			yaxis: {
				title: yax
			},
			xaxis: {
				automargin: true
			}
		  };
		  
		  

		  var trace2 = {
			x: xbest,
			y: ybest,
			type: "bar",
			marker: {
				color: "darkgreen"
			}
		  };
		  
		  var data2 = [trace2];
		  
		  var layout2 = {
			title: `Top 10 Cities (${dateselector.node().value})`,
			yaxis: {
				title: yax
			},
			xaxis: {
				automargin: true
		}
		  };
		  console.log(trace2);
		//###################################################################################
		Plotly.newPlot("best_plot", data2, layout2);
		Plotly.newPlot("worst_plot", data1, layout1);
		//################################################################################### 
		
		
		
		//###################################################################################
/*
		
		//plotting things starts here
		
		var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			maxZoom: 18,
			id: "mapbox.light",
			accessToken: API_KEY
			});
		
		var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			maxZoom: 18,
			id: "mapbox.dark",
			accessToken: API_KEY
			});
		
		//establish map background types
		var baseMaps = {
			Light: light,
			Dark: dark,
			};
					
		//add the map, set default layers
		var myMap = L.map("map", {
			center: [33, -95.95],
			zoom: 4,
			layers: [light]
			});
			
		// Pass our map layers into our layer control
		// Add the layer control to the map
		L.control.layers(baseMaps).addTo(myMap);
*/




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
			var firstdate = sorted[sorted.length-1]
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
	
	dateselector.html("")
	for (var k = 0; k < (sortedunique.length -1); k++){
		dateselector.append("option").text(sortedunique[k])
		};
	
	});

};
getdatelist();



date = "2020-04-14"
refreshdata();