import {formatPrice} from "./helpers.js";

/**
 * An event is something that occurs once in the game session. Can be either positive or negative.
 * Every event is an object with the following properties:
 * - id: unique identifier
 * - isReadyToOccur: returns true if the event is ready to occur (all conditions are met)
 * - getContent: returns the content of the event that will be displayed in the UI
 * - occur: applies the event to the game context
 */
export const createGameEvents = function() {

	/**
	 * Has no effects when occur. It just displays a message.
	 */
	const elderBrotherSupport = new function() {
		this.id = "elder_brother_support"
		this.isReadyToOccur = function(ctx) {
			return !ctx.occurred_events.includes(this.id) && ctx.applied_effects.includes("elder_brother")
		}
		this.getContent = function() {
			return `Your elder brother has offered his help. You accepted. Now you both are taxi drivers. Sounds like a good foundation for a future #1 taxi company.`
		}
		this.occur = function(ctx) {
			ctx.occurred_events.push(this.id)
		}
	}

	const municipalSupport = new function() {
		const amount = 1000

		this.id = "municipal_support"
		this.isReadyToOccur = function(ctx) {
			return !ctx.occurred_events.includes(this.id) && ctx.total_money >= 4500.00
		}
		this.getContent = function() {
			return `You've got the support from your city's government for developing your small business.<br><b>+${formatPrice(amount)}</b>`
		}
		this.occur = function(ctx) {
			ctx.total_money += amount
			ctx.occurred_events.push(this.id)
		}
	}

	const inflation1 = new function() {
		const newRidePrice = 2.99

		this.id = "inflation1"
		this.isReadyToOccur = function(ctx) {
			return !ctx.occurred_events.includes(this.id) && ctx.total_ride_count >= 700
		}
		this.getContent = function() {
			return `The inflation does its job. The new ride price is <b>${formatPrice(newRidePrice)}</b>`
		}
		this.occur = function(ctx) {
			ctx.ride_price = newRidePrice
			ctx.occurred_events.push(this.id)
		}
	}

	const competitorBankrupt = new function() {
		const newRidePrice = 3.49

		this.id = "competitor_bankrupt"
		this.isReadyToOccur = function(ctx) {
			return !ctx.occurred_events.includes(this.id) && ctx.total_ride_count >= 2500 }
		this.getContent = function() {
			return `One of the competitors has just gone bankrupt. You can rise the ride price a bit.<br>The new ride price is <b>${formatPrice(newRidePrice)}</b>`
		}
		this.occur = function(ctx) {
			ctx.ride_price = newRidePrice
			ctx.occurred_events.push(this.id)
		}
	}

	const mobileAppIsConvenient = new function() {
		this.id = "mobile_app_is_convenient"
		this.isReadyToOccur = function(ctx) {
			return !ctx.occurred_events.includes(this.id) && ctx.applied_effects.includes("mobile_app")
		}
		this.getContent = function() {
			return `Having mobile app is convenient for drivers. It becomes easier to find the new ones. The <b>hire price</b> is <b>reduced twice</b>.`
		}
		this.occur = function(ctx) {
			ctx.hire_driver_price /= 2
			ctx.occurred_events.push(this.id)
		}
	}

	return [
		elderBrotherSupport,
		municipalSupport,
		inflation1,
		competitorBankrupt,
		mobileAppIsConvenient
	]
}

