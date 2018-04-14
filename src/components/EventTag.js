import React, { Component } from 'react';

class EventTag extends Component {
  render() {
		const {handleClick, handleHoverIn, handleHoverOut, tag} = this.props;
		return (
				<div
					onClick={handleClick}
					onMouseOver={handleHoverIn}
					onMouseLeave={handleHoverOut}
					className="option event-tag"
					data-value={tag}>
					{tag}
				</div>
    );
  }
}

export default EventTag;
