export const unDuplicateEvents = (events) => {
	let updatedEvents = [];
	events.forEach(event=>{
		const matchedEvent = updatedEvents.find(eventInArray => (eventInArray.title === event.title));
		const matchedEventIndex = updatedEvents.findIndex(eventInArray => (eventInArray.title === event.title));
		if(typeof matchedEvent === 'undefined'){
			updatedEvents.push(event)
		}else{
			if(typeof updatedEvents[matchedEventIndex].additionalDates === 'undefined'){
				updatedEvents[matchedEventIndex].additionalDates = [];
				updatedEvents[matchedEventIndex].additionalDates.push(event);
			}else{
				updatedEvents[matchedEventIndex].additionalDates.push(event);
			}
		}
	});

	function findAnomalies(event){
		// if an event has additionalDates then look for anomalous event locations
		if(event.additionalDates){
			const matchEvent = event.additionalDates.find(item=>item.location.location.longitude!==event.location.location.longitude);
			const matchEventIndex = event.additionalDates.find(item=>item.location.location.longitude!==event.location.location.longitude);

			if(typeof matchEvent !== 'undefined' && !updatedEvents.includes(matchEvent)){
				event.additionalDates.splice(matchEventIndex,1);
				updatedEvents.push(matchEvent);
				findAnomalies(event);
			}
		}
	}

	// call the anomaly seeker function on each event in the updated array
	updatedEvents.forEach(event=>{
		findAnomalies(event);
	});
	return updatedEvents;
};

export const listEventTypes = (events) => {
	let eventBox = [];
	events.forEach(event=>{
		if(!eventBox.includes(event.type)){
			console.log(event.type);
		}
		eventBox.push(event.type);
	});
};

export const calcDistance = (lat1, lon1, lat2, lon2, unit) => {
	const radlat1 = Math.PI * lat1/180;
	const radlat2 = Math.PI * lat2/180;
	const theta = lon1-lon2;
	const radtheta = Math.PI * theta/180;
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit==="K") { dist = dist * 1.609344 };
	if (unit==="N") { dist = dist * 0.8684 };
	return dist;
};
