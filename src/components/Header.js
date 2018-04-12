import React, { Component } from 'react';

class Header extends Component {
	constructor(){
		super();
		this.state = {
			inputVal:''
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

  render() {
		const { inputVal } = this.state;
		const { showError, activeDistrict, headerHeight } = this.props;
		const headerStyle = {height:headerHeight};
		return (
      <div style={headerStyle} className="Header">
				<form onSubmit={this.handleSubmit}>
					<input type='text' value={inputVal} onChange={this.handleChange}/>
					<button>Submit</button>
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
