const unDuplicateEvents = (events) => {
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
}

export default unDuplicateEvents;
