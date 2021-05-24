// Mapbox GL JS
mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

var marker = new mapboxgl.Marker({
    color: "#f72585",
    draggable: true
    })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 20})
        .setHTML(
            `<h6>${campground.title}</h6>`
        )
    )
    .addTo(map);