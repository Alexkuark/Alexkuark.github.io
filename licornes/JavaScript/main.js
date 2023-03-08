var map;
var baseLayers;
var mycontrol;
var overlays = {};

function actualiser(){

	map.locate({setView: true, maxZoom: 16});

}

$(document).ready(function(){

	map = L.map("map").setView([43.6323, 3.8702986], 16);
	
	$.getJSON("json/Universites.geojson", function( data ) {
		overlays.universites = L.layerGroup();
		L.geoJSON(data, {
			style: function (feature) {
				return {color: feature.properties.color};
			}
		}).bindPopup(function (layer) {
			return layer.feature.properties.name;
		}).addTo(map);

		mycontrol.addOverlay(overlays.universites, 'Universités');
	});
	
	$.getJSON("json/LieuxDiffusion.geojson", function( data ) {
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
	
	$.getJSON("json/Partenaires.geojson", function( data ) {
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
