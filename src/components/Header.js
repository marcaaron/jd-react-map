import React, { Component } from 'react';
import EventFilter from './EventFilter';
import triangle from './triangle';
class Header extends Component {
	constructor(){
		super();
		this.state = {
			inputVal:'',
			btnStyle: {backgroundColor:'rgba(36,80,87,1)'},
			svgStyle: {fill:'rgba(36,80,87,1)'}
		}
	}

	handleChange = (e) => {
		const inputVal = e.target.value;
		this.setState({inputVal});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.getDistrict(this.state.inputVal);
		const inputVal = '';
		this.setState({inputVal});
	}

	handleHoverIn = () => {
		const svgStyle = {fill:'rgb(82, 186, 203)'};
		const btnStyle = {backgroundColor:'rgb(82, 186, 203)'};
		this.setState({svgStyle,btnStyle});
	}

	handleHoverOut = () => {
		const svgStyle = {fill:'rgba(36,80,87,1)'};
		const btnStyle = {backgroundColor:'rgba(36,80,87,1)'};
		this.setState({svgStyle,btnStyle});
	}

  render() {
		const { inputVal } = this.state;
		const { showError, filter, handleFilter, activeDistrict, headerHeight } = this.props;
		const headerStyle = {height:headerHeight};
		return (
      <div style={headerStyle} className="Header">
				<EventFilter
					filter={filter}
					handleFilter={handleFilter}
				/>
				<form onSubmit={this.handleSubmit}>
					<div className="searchbar-text">
						<div className="district-header">
							What congressional district are you in?
						</div>
						<div className="district-subheader">
							If you know your congressional district, type it in – otherwise, type in your address and we'll figure it out.
						</div>
					</div>
					<div className="search-bar-container">
						<input className="search-bar" type='text' value={inputVal} onChange={this.handleChange}/>
						<svg onMouseEnter={this.handleHoverIn} onMouseLeave={this.handleHoverOut} className="search-triangle" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
						<path d={triangle.d} transform={triangle.transform} style={this.state.svgStyle}/>
					</svg>
						<button onMouseEnter={this.handleHoverIn} onMouseLeave={this.handleHoverOut} style={this.state.btnStyle} className="submit-btn">SUBMIT</button>
					</div>
				</form>

				{
					activeDistrict !== '' && !showError &&
					<div className="district">Your District: {activeDistrict}</div>
				}
				{
					showError &&
					<div className="error">Oops! We couldn't find your district!</div>
				}

      </div>
    );
  }
}

export default Header;
