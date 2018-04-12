import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import geoJsonData from '../GeoJSON.json';

class Map extends Component {
	componentWillMount(){
		mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
	}

	componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
			center: [-98.585522, 39.8333333],
			zoom:3.5
    });

		let colors=['#d0a8ff','#86b3f9','#85e2f9','#85f9b7','#cef985','#f9dd85','#f98585',];

		let districtGeoJson = [];

		this.map.on('load', ()=>{
			for(let district in geoJsonData){
				let color = colors[Math.floor(Math.random() * Math.floor(colors.length))];
				this.map.addLayer({
					'id': district,
					'type': 'fill',
					'source': {
						'type': 'geojson',
						'data': {
								'type': 'Feature',
								'geometry': {
										'type': 'MultiPolygon',
										'coordinates': geoJsonData[district]
									}
							}
					},
					'layout': {},
					'paint': {
							'fill-color': color,
							'fill-opacity': 0.8
					}
				});
			}
		});
	}

	componentDidUpdate(){
		if(this.props.geoJsonDistrict){

		}
	}

	componentWillUnmount() {
   	this.map.remove();
  }

	render() {
		const {headerHeight} = this.props;
		const style = {
      position: 'absolute',
      top: headerHeight,
      bottom: 0,
      width: '100%'
    };

    return (
      <div style={style} ref={el => this.mapContainer = el} />
    );
  }
}

export default Map;
