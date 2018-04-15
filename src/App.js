import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import {unDuplicateEvents} from './helpers/helpers';
// import {listEventTypes} from './helpers/helpers';
import {calcDistance} from './helpers/helpers';

const headers = {
	method: 'GET',
	headers: {
	"Accept": "application/json",
	'Content-Type': 'application/json',
	"Accept-Encoding": "gzip"
	}
};
let events = [];
const urlPrepend = 'https://cors-anywhere.herokuapp.com/';

class App extends Component {
	constructor(){
		super();
		this.state = {
			activeDistrict:'',
			showError: false,
			geoJsonDistrict:null,
			markers:null,
			filter:'All',
			mapHeight:'',
			previousFilter:'All',
			positionLat:'',
			positionLong:'',
			center:''
		}
	}

	componentDidMount(){
		const url = `${urlPrepend}http://jd-maps.gigalixirapp.com/api/events`;
		const getMarkers = (url) => {
			return fetch(url, headers)
				.then(response => {
					if(response.ok){
						return response.json();
					}
					throw new Error('Unable to Fetch Events');
				})
				.then(data=>{
					events = unDuplicateEvents(data);
					const markers = events;

					// Uncomment to console.log event types...
						// listEventTypes(markers);

					this.setState({markers});
				})
		}
		getMarkers(url);
	}

	handleFilter = (filter) => {
		this.updateMarkers(filter);
		this.setState({filter});
	}

	getMapHeight = (height) =>{
		const mapHeight = height;
		this.setState({mapHeight});
	}

	updateMarkers = (filter) => {
		if(filter !== this.state.previousFilter){
			this.clearMarkers();
		}

		let markers = events;

		if(filter !== 'All'){
			markers = events.filter(event=>{
				switch(filter){
					case 'Canvass':
					if(event.type==='Canvass') return event;
					break;
					case 'Tabling':
					if((event.type === 'Tabling or Clipboarding') || (event.type === 'Tabling or clipboarding')) return event;
					break;
					case 'Phone Banks':
					if((event.type==='Phonebank')||(event.type==='Phone Banks')) return event;
					break;
					case 'Community Event':
					if((event.type==='Rally, march, or protest')||(event.type==='Organizing meeting')||(event.type==='Community Event')) return event;
					break;
					default:
					console.warn('No Event Types with That Filter');
				}
				return false;
			});
		}

		this.setState({markers, previousFilter:filter});
	}

	clearMarkers = () => {
		const markers = [...document.querySelectorAll('.mapboxgl-marker')];
		markers.forEach(marker=>marker.remove());
	}

	getDistrict = (query) => {
		const url = `${urlPrepend}https://map.justicedemocrats.com/api/district/search?q=${query}`;
		const fetchDistrict = (url) => {
			return fetch(url, headers)
				.then(response => {
					if(response.ok){
						return response.json();
					}
					throw new Error('Server Failed or District Not Found');
				})
				.then(data => {
					const activeDistrict = data.district;
					const geoJsonDistrict = data.geojson;
					const showError = false;
					this.setState({showError, activeDistrict, geoJsonDistrict});
				})
				.catch((err)=>{
					console.log(err);
					const showError = true;
					this.setState({showError})
				})
		}
		fetchDistrict(url);
	}

	updateCenter = (center) => {
		this.setState({center});
	}

	componentDidUpdate(){
		if(this.state.activeDistrict && this.state.center){
			console.log(this.state.activeDistrict, this.state.center);
		}
		// This is a function that sorts the markers by distance from the center of the map but must be passed this.map in order to getCenter and any FlyTo functions must be finished before we getCenter.... this function needs to run in App.js so that markers can be updated and passed to sidebar and map respectively - only problem is... in order to return the center coords the map component will update after it calls the props function. and an update triggers a zoom on the activeDistrict and re-rendering o

		// const center = this.map.getCenter();
		// function sortByDistance(a,b){
		// 	return (calcDistance(center.lng, center.lat, a.location.location.longitude, a.location.location.latitude)) - (calcDistance(center.lng, center.lat, b.location.location.longitude, b.location.location.latitude));
		// }
		// let markers = this.props.markers;
		// console.log(markers.sort(sortByDistance));
	}

  render() {
		const headerHeight='200px';
		const {mapHeight, filter, markers, activeDistrict, geoJsonDistrict, showError} = this.state;
    return (
      <div className="App">
				<Header
					getDistrict={this.getDistrict}
					headerHeight={headerHeight}
					activeDistrict={activeDistrict}
					showError={showError}
					filter={filter}
					handleFilter={this.handleFilter}
				/>
				<div className="map-container">
					<Map
						updateCenter = {this.updateCenter}
						getMapHeight = {this.getMapHeight}
						markers = {markers}
						filter = {filter}
						events = {events}
						activeDistrict={activeDistrict}
						geoJsonDistrict={geoJsonDistrict}
						headerHeight={headerHeight}
					/>
					{
						mapHeight &&
						<Sidebar mapHeight={mapHeight} markers = {markers}/>
					}
				</div>
      </div>
    );
  }
}

export default App;
