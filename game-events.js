const gameEvents = function(){
	const governmentSupport = new function() {
		this.id = "government_suport"
		this.isReadyToOccur = function (ctx) { return !ctx.occured_events.includes(this.id) && ctx.total_money >= 4500.00 },
	}

	return []
}()