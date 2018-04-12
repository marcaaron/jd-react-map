import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';
import Header from './components/Header';

import './mapbox-gl.css';

const headers = {
	method: 'GET',
	headers: {
	"Accept": "application/json",
	'Content-Type': 'application/json',
	"Accept-Encoding": "gzip"
	}
};

const urlPrepend = 'https://cors-anywhere.herokuapp.com/';

class App extends Component {
	constructor(){
		super();
		this.state = {
			activeDistrict:'',
			showError: false,
			geoJsonDistrict:null
		}
	}

	componentDidMount(){
	}

	getDistrict = (query) => {
		console.log(query);
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
					console.log(data);
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

  render() {
		const headerHeight='70px';
		const {activeDistrict, geoJsonDistrict, showError} = this.state;
    return (
      <div className="App">
				<Header
					getDistrict={this.getDistrict}
					headerHeight={headerHeight}
					activeDistrict={activeDistrict}
					showError={showError}
				/>
				<Map
					activeDistrict={activeDistrict}
					geoJsonDistrict={geoJsonDistrict}
					headerHeight={headerHeight}
				/>
      </div>
    );
  }
}

export default App;
