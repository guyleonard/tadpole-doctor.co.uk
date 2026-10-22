//
// Community results map
// Points are postcode district centres, not exact sampling sites
//

window.addEventListener('DOMContentLoaded', event => {

    const mapElement = document.getElementById('results_map');
    if (!mapElement || typeof L === 'undefined') {
        return;
    }

    const map = L.map(mapElement, { scrollWheelZoom: false }).setView([54.5, -3], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Only allow scroll zoom once the map has been clicked
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    fetch('assets/data/tadpole_doctor_results.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split('\n').slice(1);
            const markers = [];
            rows.forEach(row => {
                const [district, lat, lon, samples, positive, negative] = row.split(',');
                const colour = Number(positive) > 0 ? '#c0392b' : '#64a19d';
                const marker = L.circleMarker([Number(lat), Number(lon)], {
                    radius: 6 + Math.sqrt(Number(samples)) * 3,
                    color: '#ffffff',
                    weight: 1,
                    fillColor: colour,
                    fillOpacity: 0.85
                }).bindPopup(
                    '<strong>' + district + '</strong><br />' +
                    'Samples: ' + samples + '<br />' +
                    'Infection positive: ' + positive + '<br />' +
                    'Infection negative: ' + negative
                ).addTo(map);
                markers.push(marker);
            });
            if (markers.length) {
                map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [20, 20] });
            }
        });

});
