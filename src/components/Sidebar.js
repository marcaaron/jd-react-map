import React, { Component } from 'react';
import SidebarEvent from './SidebarEvent';

class Sidebar extends Component {
  render() {
		return (
      <div style={{height:this.props.mapHeight}} className="Sidebar">
				{
					this.props.markers &&
					this.props.markers.map((marker)=>{
						return <SidebarEvent key={`sidebar_${marker.id}`} marker={marker}/>
					})
				}
      </div>
    );
  }
}

export default Sidebar;
