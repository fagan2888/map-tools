
var map;
var path;

function initMap() {

    // Default location
    var pos_default = {lat: 40.704107, lng: -74.014772},
        pos = pos_default
    gps = [],
    label = document.getElementById('label'),
    zoom_default = 6;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom_default,
        center: pos,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        clickableIcons: false
    });

    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    marker.setMap(null);

    path = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 3
    });
    path.setMap(map);

    // Try HTML5 geolocation
    // if (navigator.geolocation) {
    if (false) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos_default = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            pos = pos_default;

            setLocation(map, marker, pos);
        }, function() {
            setLocation(map, marker, pos);
        });
    } else {
        setLocation(map, marker, pos);
    }

    function setLocation(map, marker, pos) {
        map.setCenter(pos);
        marker.setPosition(pos);
    };

    // Update marker, array of GPS coords, summary table for double click
    var tbl = document.getElementById('tbl'),
        tbl_switch = true;
    // Initialize coordinate table
    instructions = function(tbl) {
        var row = tbl.insertRow(-1),
            c1 = row.insertCell(0),
            c2 = row.insertCell(1);
        c1.colSpan = 2;
        c1.textContent = "No points added.";
        tbl_switch = true;
        marker.setMap(null);
    }
    instructions(tbl)

    google.maps.event.addListener(map, 'dblclick', function(event) {
        var pos = {lat: event.latLng.lat(), lng: event.latLng.lng()};

        // Re-center
        setLocation(map, marker, pos);
        // Update 
        gps.push(pos);

        // Update 
        path.getPath().push(event.latLng);

        if (tbl_switch) {
            tbl.deleteRow(1);
            marker.setMap(map);
            tbl_switch = false;
        }

        var row = tbl.insertRow(-1),
            c1 = row.insertCell(0),
            c2 = row.insertCell(1),
            c3 = row.insertCell(2);

        // number of lat / lng digits
        var k = 6;
        c1.textContent = pos.lat.toFixed(k);
        c2.textContent = pos.lng.toFixed(k);
    });

    // Undo last point
    document.getElementById('undo').addEventListener('click', function() {
        if (gps.length > 0) {
            tbl.deleteRow(-1);
            gps.pop();
            path.getPath().pop();

            if (gps.length > 0) {
                setLocation(map, marker, gps[gps.length-1]);
            } else {
                setLocation(map, marker, pos_default);
                map.setZoom(zoom_default);
                instructions(tbl);
            }
        }
    });

    // Reset
    document.getElementById('reset').addEventListener('click', function() {
        if (gps.length > 0) {
            while (gps.length > 0) {
                gps.pop();
                path.getPath().pop();
                tbl.deleteRow(-1);
            }
            marker.setMap(null);
            tbl_switch = false;
            instructions(tbl);
        }
    });

    // CSV download when click
    document.getElementById('csv').addEventListener('click', function() {
        if (gps.length > 0) {
            var delim = '%2C',
                nl = '%0A',
                txt = 'data:application/octet-stream,lat'.concat(delim, 'lng', nl);

            for (i=0; i < gps.length; i++) {
                var x = gps[i];
                txt = txt.concat(String(x.lat), delim, String(x.lng), nl);
            }
            document.getElementById('csv').href = txt;
        }
    });
}

