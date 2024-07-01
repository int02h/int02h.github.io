const createGameEvents = function() {

	const municipalSupport = new function() {
		const amount = 1000

		this.id = "municipal_support"
		this.isReadyToOccur = function(ctx) { return !ctx.occurred_events.includes(this.id) && ctx.total_money >= 4500.00 },
		this.getContent = function(ctx) { return `You've got the support from your city's government for developing your small business.<br><b>+${formatPrice(amount)}</b>` }
		this.occur = function(ctx) {
			ctx.total_money += amount
			ctx.occurred_events.push(this.id)
		}
	}

	const inflation1 = new function() {
		const newRidePrice = 2.99

		this.id = "inflation1"
		this.isReadyToOccur = function(ctx) { return !ctx.occurred_events.includes(this.id) && ctx.total_ride_count >= 700 },
		this.getContent = function(ctx) { return `The inflation does its job. The new ride price is <b>${formatPrice(newRidePrice)}</b>` }
		this.occur = function(ctx) {
			ctx.ride_price = newRidePrice
			ctx.occurred_events.push(this.id)
		}
	}

	const competitorBankrupt = new function() {
		const newRidePrice = 3.49

		this.id = "competitor_bankrupt"
		this.isReadyToOccur = function(ctx) { return !ctx.occurred_events.includes(this.id) && ctx.total_ride_count >= 2500 },
		this.getContent = function(ctx) { return `One of the competitors has just gone bankrupt. You can rise the ride price a bit.<br>The new ride price is <b>${formatPrice(newRidePrice)}</b>` }
		this.occur = function(ctx) {
			ctx.ride_price = newRidePrice
			ctx.occurred_events.push(this.id)
		}
	}

	const mobileAppIsConvenient = new function() {
		this.id = "mobile_app_is_convenient"
		this.isReadyToOccur = function(ctx) { return !ctx.occurred_events.includes(this.id) && ctx.applied_effects.includes("mobile_app") },
		this.getContent = function(ctx) { return `Having mobile app is convenient for drivers. It becomes easier to find the new ones. The <b>hire price</b> is <b>reduced twice</b>.` }
		this.occur = function(ctx) {
			ctx.hire_driver_price /= 2
			ctx.occurred_events.push(this.id)
		}
	}

	return [
		municipalSupport,
		inflation1,
		competitorBankrupt,
		mobileAppIsConvenient
	]
}

