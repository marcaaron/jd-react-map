import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import geoJsonData from '../GeoJSON.json';
import extent from 'turf-extent';
import {multiPolygonToLine} from '@turf/polygon-to-line';

class Map extends Component {
	constructor(){
		super();
		this.state = {
			previousFilter:null
		}
	}
	componentWillMount(){
		mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
	}

	componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
			center: [-98.585522, 39.8333333],
			zoom:3.5
    });

		let colors=['#d0a8ff','#86b3f9','#85e2f9','#85f9b7','#cef985','#f9dd85','#f98585'];

		this.map.on('load', ()=>{
			const height = document.querySelector('.mapboxgl-map').getBoundingClientRect().height;
			this.props.getMapHeight(height);
			const nav = new mapboxgl.NavigationControl();
			this.map.addControl(nav, 'top-left');

			for(let district in geoJsonData){
				let color = colors[Math.floor(Math.random() * Math.floor(colors.length))];
				const layer = {
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
				};
				const line = multiPolygonToLine(layer.source.data.geometry);
				const lineLayer = {
					'id': `line_${district}`,
					'type': 'line',
					'source': {
						'type': 'geojson',
						'data': line
					},
					"layout": {
            "line-join": "round",
            "line-cap": "round",
						"visibility":"none"
	        },
					'paint': {
							'line-color': '#000',
							'line-width': 2
					}
				};

				this.map.addLayer(layer);
				this.map.addLayer(lineLayer);

				const clickDistrict = (e) => {
					const bbox = extent(layer.source.data.geometry);
					this.map.fitBounds(bbox, {padding:20});
				}

				const hoverDistrict = (e) => {
					this.map.setLayoutProperty(`line_${district}`, 'visibility', 'visible');
				}

				const exitDistrict = (e) => {
					this.map.setLayoutProperty(`line_${district}`, 'visibility', 'none');
				}

				this.map.on('click', district, clickDistrict);
				this.map.on('mousemove', district, hoverDistrict);
				this.map.on('mouseleave', district, exitDistrict);
			}
		});
	}

	flyToLocation = (coords, zoom) => {
		this.map.flyTo({
			center: coords,
			zoom: zoom,
			speed: 4,
			curve:1
		});
	}

	componentWillUnmount() {
   	this.map.remove();
  }

	componentDidUpdate(){
		if(this.props.activeDistrict){
			const bbox = extent(this.props.geoJsonDistrict);
			this.map.fitBounds(bbox, {padding:20});
			console.log(this.props.geoJsonDistrict);
		}

		// Add Markers
		if(this.props.markers){
			if(this.state.previousFilter !== this.props.filter){
				console.log('updating markers');
				this.props.markers.forEach(marker=>{
					let icon;
					switch(marker.type){
					case 'Canvass':
						icon = 'canvass';
						break;
					case 'Tabling or Clipboarding':
					case 'Tabling or clipboarding':
						icon = 'clipboard';
						break;
					case 'Phonebank':
					case 'Phone Banks':
						icon = 'phone';
						break;
					case 'Rally, march, or protest':
					case 'Organizing meeting':
					case 'Community Event':
						icon = 'protest';
						break;
					default:
						icon = 'default';
						break;
					}

					const el = document.createElement('div');
					el.style.width = '30px';
					el.style.height = '30px';
					el.style.cursor = 'pointer';
					el.style.backgroundImage = `url(./icons/${icon}.svg)`;

					const long = marker.location.location.longitude;
					const lat = marker.location.location.latitude;
					const popup = new mapboxgl.Popup()
    				.setHTML(`<div>${marker.title}</div>`);

					new mapboxgl.Marker(el)
						.setLngLat([long,lat])
						.setPopup(popup)
						.addTo(this.map);


					// On Click Function
					const clickPoint = (e) => {
						// e.stopPropagation();
						document.getElementById(`_sidebar_${marker.id}`).scrollIntoView({behavior:"smooth", block:"start", inline:"start"});
						this.flyToLocation([long,lat], 10);
					}

					el.addEventListener('click', clickPoint);
					const previousFilter = this.props.filter;
					this.setState({previousFilter});
				});
			}
		}
	}

	render() {
		const {headerHeight} = this.props;
		const style = {
      position: 'absolute',
      top: headerHeight,
      bottom: 0,
      width: '70%'
    };

    return (
	      <div className="MAPBOX" key="map" style={style} ref={el => this.mapContainer = el}/>
		);
  }
}

export default Map;
