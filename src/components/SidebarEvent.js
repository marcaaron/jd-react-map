import React, { Component } from 'react';

class SidebarEvent extends Component {

  render() {
		const {marker} = this.props;
    // console.log(marker);
		return (
      <div id={`_sidebar_${marker.id}`} className="SidebarEvent">
        <div className="sidebar-info">
  				<p className="sidebar-title">{marker.title}</p>
          <p className="sidebar-date">{marker.date_line}</p>
          <p className="sidebar-location">{marker.location.venue}</p>
          <p className="sidebar-address">{marker.location.address_lines[0]}</p>
          <p className="sidebar-city-state-zip">{marker.location.locality}, {marker.location.region} {marker.location.postal_code}</p>
          <a href={marker.browser_url}><button className="sidebar-rsvp">RSVP</button></a>
        </div>
      </div>
    );
  }
}

export default SidebarEvent;
