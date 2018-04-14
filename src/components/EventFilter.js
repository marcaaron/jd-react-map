import React, { Component } from 'react';
import EventTag from './EventTag';

class EventFilter extends Component {
	constructor(){
		super();
		this.state = {
			translateX:0,
			filterIndex:0,
			color:'rgba(245,255,64, 1)'
		}
	}

	handleClick = (e) => {
		const tags = [...document.querySelectorAll('.event-tag')];
		const filterIndex = tags.indexOf(e.target);
		this.setState({filterIndex});
		this.props.handleFilter(e.target.dataset.value);
	}

	handleHoverIn = (e) => {
		const parentWidth = e.target.parentNode.getBoundingClientRect().width;
		const tags = [...document.querySelectorAll('.event-tag')];
		const tagWidth = parentWidth/tags.length;
		const multiplier = tags.indexOf(e.target);
		const translateX = multiplier * tagWidth;
		const color = 'rgba(245,255,64,0.3)';
		this.setState({translateX, color});
	}

	handleHoverOut = (e) => {
		const parentWidth = e.target.parentNode.getBoundingClientRect().width;
		const tags = [...document.querySelectorAll('.event-tag')];
		const tagWidth = parentWidth/tags.length;
		const multiplier = this.state.filterIndex;
		const translateX = multiplier * tagWidth;
		const color = 'rgba(245,255,64,1)';
		this.setState({translateX, color});
	}

  render() {
		const bubbleStyle={
			transform:`translateX(${this.state.translateX}px)`,
			backgroundColor: this.state.color
		};
		const eventTags = ["All","Canvass","Phone Banks", "Tabling", "Community Event"];

		return (
      <div className="event-filter">
				{
					eventTags.map(tag=>{
						return <EventTag key={tag} handleClick={this.handleClick} handleHoverIn={this.handleHoverIn} handleHoverOut={this.handleHoverOut} tag={tag}/>
					})
				}
				<div style={bubbleStyle} className="option option-background"></div>
      </div>
    );
  }
}

export default EventFilter;
