import React, { Component } from 'react';

class SidebarEvent extends Component {

  render() {
		const {marker} = this.props;
		return (
      <div id={`_sidebar_${marker.id}`} className="SidebarEvent">
				<span>{marker.title}</span>
      </div>
    );
  }
}

export default SidebarEvent;
