
var map;
var path;
var bounds;
var polyline;

function init() {

    polyline = new google.maps.Polyline();

    var pos_default = {lat: 40.704107, lng: -74.014772},
        zoom_default = 6;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom_default,
        center: pos_default,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        clickableIcons: false
    });

    var r = new FileReader();
    document.getElementById('file').addEventListener('change', file_select, false);

    function file_select(event) {
        var f = event.target.files[0];
        r.readAsText(f);
        r.onload = (function(e) {
            path = [];
            polyline.setMap(null);
            bounds = new google.maps.LatLngBounds();
            var csv = r.result.split('\n');
            // Dumb assumption that CSV is valid, as lat,lng
            for (var i=1; i < csv.length-1; i++) {
                var d = csv[i].split(',');
                var p = {lat: parseFloat(d[0]),
                         lng: parseFloat(d[1])};
                path.push(p);
                bounds.extend(new google.maps.LatLng(d[0],d[1]));
            }
            initPath(path);
            map.setCenter(path[0]);
            map.fitBounds(bounds);
        });
    }

    document.getElementById('reset').addEventListener('click', function() {
        if (path.length > 0) {
            polyline.setMap(null);
            path = [];
        }
    });
}

function initPath(path) {

    polyline = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 3,
        path: path
    });
    polyline.setMap(map);

}

