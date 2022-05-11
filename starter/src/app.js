/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Loader } from '@googlemaps/js-api-loader'
import MarkerClusterer from '@google/markerclustererplus'

/**
 * Required by the Loader Class to specify various options,
 * including the API key, version of the API, and other
 * Maps JS API libraries.
 */
const apiOptions = {
    apiKey: "AIzaSyDNIZ98lanupJMTsPbnPxpzWh2AIvtCDPg"
}

/**
 * Creating a new Loader instance, passing our options.
 */
const loader = new Loader(apiOptions);

/**
 * To load the API, call .load() on the loader.
 * This returns a promise that resolves once the
 * API is loaded and ready to use. This promise is
 * the callback function that is executed once the
 * API is done loading.
 */
loader.load().then(() => {
    console.log('Maps JS API loaded');
    const map = displayMap();
    const markers = addMarkers(map);
    clusterMarkers(map, markers);
    addPanToMarker(map, markers);
});

/**
 * A function to call inside the map loader.
 * @returns map a map object to be presented within the DIV
 * NOTE: Updating the mapId style may take up to
 * about a minute to refresh on Google's end.
 */
function displayMap() {

    /**
     * Two map settings are required: center, and zoom
     * The following centers the map on Sydney, Australia,
     * and gives a zoom level of 14, which is just the right
     * zoom level to show the city center.
     */
    const mapOptions = {
        center: { lat: -33.860664, lng: 151.208138 },
        zoom: 14,
        mapId: 'f1131a66dca617c9'
    }

    /**
     * Getting the div where the map should be injected
     * into the DOM.
     */
    const mapDiv = document.getElementById('map');

    /**
     * Creating an instance of google.maps.Map, pass in
     * the HTML destination and map options.
     */
    const map = new google.maps.Map(mapDiv, mapOptions);

    return map;
}

/**
 * This function adds markers (pins) to the map. These are
 * common UI elements for handling user interaction.
 * 1. Define an object for marker locations.
 * 2. Create an instance of google.maps.Marker for each
 * marker to be displayed
 * 3. Display the markers
 *
 * *** NOTE *** : The "icon" property allows us to provide
 * the path to any image file we want to use as a custom
 * marker.
 */
function addMarkers(map) {
    /**
     * The locations object for each marker (pin).
     */
    const locations = {
        operaHouse: { lat: -33.8567844, lng: 151.213108 },
        tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
        manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
        hyderPark: { lat: -33.8690081, lng: 151.2052393 },
        theRocks: { lat: -33.8587568, lng: 151.2058246 },
        circularQuay: { lat: -33.858761, lng: 151.2055688 },
        harbourBridge: { lat: -33.852228, lng: 151.2038374 },
        kingsCross: { lat: -33.8737375, lng: 151.222569 },
        botanicGardens: { lat: -33.864167, lng: 151.216387 },
        museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
        maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
        kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
        aquarium: { lat: -33.869627, lng: 151.202146 },
        darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
        barangaroo: { lat: - 33.8605523, lng: 151.1972205 }
    }

    /**
     * The markers array that gets returned.
     */
    const markers = [];

    /**
     * Iterate through each location to create a set of options
     * for how each marker should be rendered. Then create an
     * instance of google.maps.Marker for each location.
     */
    for (const location in locations) {
        const markerOptions = {
            map: map,
            position: locations[location],
            /**
             * This icon can be anything we want it to be, like
             * something COVID related, or health related, etc.
             * Masks?...
             * Vaccines/syringe graphic?...
             * Coughing person?...
             * Color-based? UPS tells me this is a bad idea...
             */
            icon: './img/custom_pin.png'
        }
        const marker = new google.maps.Marker(markerOptions);
        markers.push(marker);
    }
    return markers;
}

/**
 * 1. Declare object that specifies path to the cluster icons.
 * 2. Create a new instance of MarkerClusterer, and pass this
 * to the instance of the Map object where this will be displayed.
 * 3. Display the clusters with clusterMarkers(map, markers) in
 * the JS API promise handler at the top.
 * @param {*} map 
 * @param {*} markers 
 */
function clusterMarkers(map, markers) {
    const clustererOptions = { imagePath: './img/m' }
    const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
}

/**
 * Add action listeners to every marker.
 * The click returns an event JSON object with information about the UI
 * element that was clicked. You can handle the click event using its
 * LatLng object to get the lat/long of the marker that was clicked.
 * 
 * Once retrieved, pass that to the Map instance's built-in panTo()
 * function to have the map smoothly pan to recenter on the clicked
 * marker.
 * 
 * This function also couples the creation of circles to the panning
 * function.
 * 
 * FINAL STEP: call the function in the JS API promise handler.
 */
function addPanToMarker(map, markers) {
    let circle;
    markers.map(marker => {
        marker.addListener('click', event => {
            const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            map.panTo(location);
            if (circle) {
                circle.setMap(null);
                circle = null;
            } else {
                circle = drawCircle(map, location);
            }
        });
    });
}

/**
 * This function will draw a circle around a marker that is 800 meters,
 * approximately 1/2 mile, in radius.
 */
function drawCircle(map, location) {
    const circleOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        map: map,
        center: location,
        radius: 800
    }
    const circle = new google.maps.Circle(circleOptions);
    return circle;
}
