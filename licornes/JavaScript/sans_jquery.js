var map;
var baseLayers;
var mycontrol;
var overlays = {};

function loadJSON(path, success, error) { 
	var xhr = new XMLHttpRequest(); 
	xhr.onreadystatechange = function() { 
		if (xhr.readyState === XMLHttpRequest.DONE) { 
			if (xhr.status === 200) { 
				if (success) {
					success(JSON.parse(xhr.responseText)); 
				}
			} 
			else { 
				if (error) {
					error(xhr); 
				}
			} 
		} 
	}; 
	xhr.open("GET", path, true);
	xhr.send(); 
} 

function actualiser(){

	map.locate({setView: true, maxZoom: 16});

	if (typeof overlays.universites == 'undefined') {
		loadJSON("json/Universites.geojson", function( data ) {

			overlays.universites = L.geoJSON(data, {
				style: function (feature) {
					return {color: feature.properties.color};
				}
			}).bindPopup(function (layer) {
				return layer.feature.properties.name;
			}).addTo(map);

			mycontrol.addOverlay(overlays.universites, 'Universités');
		});
	}

	loadJSON("json/LieuxDiffusion.geojson", function( data ) {

		if (typeof overlays.LieuxDiffusion !== 'undefined') {
			mycontrol.removeLayer(overlays.LieuxDiffusion);
		}
		overlays.LieuxDiffusion = L.geoJSON(data, {
				pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, {
						radius: 5,
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					});
				}
			}).bindPopup(function (layer) {
				return layer.feature.properties.Name;
			}).addTo(map);

			mycontrol.addOverlay(overlays.LieuxDiffusion, 'Lieux de diffusion');
	});

	loadJSON("json/Partenaires.geojson", function( data ) {

		if (typeof overlays.partenaires !== 'undefined') {
			mycontrol.removeLayer(overlays.partenaires);
		}
		overlays.partenaires = L.geoJSON(data, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
							iconUrl: feature.properties.logo,
							iconSize:     [50, 50]
						})
					});
				}
			}).bindPopup(function (layer) {
				return layer.feature.properties.nom;
			}).addTo(map);

			mycontrol.addOverlay(overlays.partenaires, 'Partenaires');
	});
}

document.addEventListener("DOMContentLoaded", function(event) {

	map = L.map("map").setView([43.6323, 3.8702986], 16);

	var popup = L.popup();

	function onMapClick(e) {
		
    	popup
        	.setLatLng(e.latlng)
        	.setContent("You clicked the map at " + e.latlng.lat + ", " + e.latlng.lng + '.')
			.openOn(map);
		
	}

	function onLocationFound(e) {
		var radius = e.accuracy;
	
		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from " + e.latlng.lat + ", " + e.latlng.lng + '.').openPopup();
	
		L.circle(e.latlng, radius).addTo(map);
	}
	
	function onLocationError(e) {
		alert(e.message);
	}

	map.on('click', onMapClick);
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		maxZoom: 20,
		attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	var GeoportailFrance_orthos = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
		attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
		bounds: [[-75, -180], [81, 180]],
		minZoom: 2,
		maxZoom: 19,
		apikey: 'choisirgeoportail',
		format: 'image/jpeg',
		style: 'normal'
	});

	map.addLayer(OpenStreetMap_France);

	// création d’un contrôle des couches pour modifier les couches de fond de plan
	baseLayers = {
		'OpenStreetMap France' : OpenStreetMap_France,
		'Orthophoto IGN' : GeoportailFrance_orthos
	};

	mycontrol = L.control.layers(baseLayers, overlays).addTo(map);
	L.control.scale({imperial:false}).addTo(map);

	actualiser();

});