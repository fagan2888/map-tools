
var map;
var path = [];

function init() {

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
            var csv = r.result.split('\n');
            // Dumb assumption that CSV is valid, as lat,lng
            for (var i=1; i < csv.length; i++) {
                var d = csv[i].split(',');
                path.push({lat: parseFloat(d[0]),
                           lng: parseFloat(d[1])});
            }
        });
    }

}

function initMap(path) {

    path = new google.maps.Polyline({
        strokeColor: '#000000',
        strokeOpacity: 0.5,
        strokeWeight: 3,
        path: path
    });
    path.setMap(map);

}

