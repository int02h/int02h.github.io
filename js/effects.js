import {formatPrice} from './helpers.js';

/**
 * An effect is something affecting game parameters.
 * Every effect is an object with the following properties:
 * - id: unique identifier
 * - getTitle: the title of the effect that will be displayed in the UI
 * - isVisible: returns true if the effect should be displayed. It is used to hide effects on early stages of the game.
 * - canApply: returns true if the effect can be applied (all conditions are met)
 * - apply: applies the effect to the game context
 */
export const createEffects = function() {

    const elderBrother = new function() {
        this.id = "elder_brother",
        this.getTitle = (ctx) => `Elder brother help`,
        this.isVisible = (ctx) => ctx.total_driver_count == 1 && ctx.total_ride_count >= 15,
        this.canApply = (ctx) => true,
        this.apply = (ctx) => {
            ctx.applied_effects.push(this.id)
            ctx.available_driver_count = 2
            ctx.total_driver_count = 2
            ctx.allowed_driver_count = 2
        }
    }

    /**
     * A driver that makes trips and earns money. Amount of drivers is limited by the license.
     */
    const driver = new function() {
        this.id = "driver"
        this.getTitle = function(ctx) { return `Hire driver ${formatPrice(ctx.hire_driver_price)}`}
        this.isVisible = function(ctx) { 
            return ctx.applied_effects.includes(taxiLicense10.id) && ctx.total_driver_count < ctx.allowed_driver_count
        }
        this.canApply = function(ctx) {
            return ctx.total_money >= ctx.hire_driver_price && ctx.total_driver_count < ctx.allowed_driver_count
        }
        this.apply = function(ctx) {
            ctx.total_money -= ctx.hire_driver_price
            ctx.hire_driver_price *= 1.1
            ctx.available_driver_count++
            ctx.total_driver_count++
        }
    }

    /**
     * A dispatcher is responsible for automatically starting rides for drivers. No player's input needed.
     */
    const dispatcher = new function() {
        const price = 250.00

        this.id = "dispatcher"
        this.getTitle = function() { return `Hire dispatcher ${formatPrice(price)}`}
        this.isVisible = function(ctx) { return !ctx.has_dispatcher && ctx.total_driver_count >= 2 }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.has_dispatcher = true
            ctx.total_money -= price
        }
    };

    /**
     * This license allows the player to hire drivers up to 10 drivers
     */
    const taxiLicense10 = new function() {
        const price = 70
        const allowedAmount = 10

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function() {
            return `Buy license to hire up to ${allowedAmount} drivers ${formatPrice(price)}`
        }
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    /**
     * This license allows the player to hire drivers up to 50 drivers
     */
    const taxiLicense50 = new function() {
        const price = 500
        const allowedAmount = 50

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function() { return `Buy license for ${allowedAmount} drivers ${formatPrice(price)}`}
        this.isVisible = function(ctx) {
            return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(taxiLicense10.id)
        }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    /**
     * This license allows the player to hire drivers up to 500 drivers
     */
    const taxiLicense500 = new function() {
        const price = 8000
        const allowedAmount = 500

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function() { return `Buy license for ${allowedAmount} drivers ${formatPrice(price)}`}
        this.isVisible = function(ctx) {
            return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(taxiLicense50.id)
        }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    /**
     * It is used to attract customers. It increases the number of riders per second.
     */
    const stickers = new function() {
        const price = 50.00

        this.id = "stickers"
        this.getTitle = function() { return `Stickers on bus stops ${formatPrice(price)}` }
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.total_driver_count >= 3 }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 1
            ctx.total_money -= price
        }
    };

    /**
     * It is used to attract customers. It increases the number of riders per second.
     */
    const leaflets = new function() {
        const price = 100.00

        this.id = "leaflets"
        this.getTitle = function() { return `Distribute leaflets ${formatPrice(price)}` }
        this.isVisible = function(ctx) {
            return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(stickers.id)
        }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 1.8
            ctx.total_money -= price
        }
    };

    /**
     * It is used to attract customers. It increases the number of riders per second.
     */
    const billboards = new function() {
        const price = 1000.00

        this.id = "billboards"
        this.getTitle = function() { return `Install billboards ${formatPrice(price)}` }
        this.isVisible = function(ctx) {
            return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(leaflets.id)
        }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 5
            ctx.total_money -= price
        }
    };

    const designLogo = new function() {
        const price = 2500.00

        this.id = "design_logo"
        this.getTitle = (ctx) => `Design fancy logo ${formatPrice(price)}`
        this.isVisible = (ctx) => !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(billboards.id)
        this.canApply = (ctx) => ctx.total_money >= price && this.isVisible(ctx)
        this.apply = (ctx) => {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 7
            ctx.total_money -= price
        }
    }

    const filmAdWithLocalStar = new function() {
        const price = 8_000.00

        this.id = "film_ad_with_local_star"
        this.getTitle = (ctx) => `File ad with local start ${formatPrice(price)}`
        this.isVisible = (ctx) => !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(designLogo.id)
        this.canApply = (ctx) => ctx.total_money >= price && this.isVisible(ctx)
        this.apply = (ctx) => {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 20
            ctx.total_money -= price
        }
    }

    /**
     * It is used to attract customers. It increases the number of riders per second.
     */
    const mobileApp = new function() {
        const price = 50_000.00

        this.id = "mobile_app"
        this.getTitle = function() { return `Develop mobile app ${formatPrice(price)}` }
        this.isVisible = function(ctx) {
            return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(filmAdWithLocalStar.id)
        }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 60
            ctx.total_money -= price
        }
    };

    return [
        elderBrother,
        driver,
        dispatcher,
        taxiLicense10,
        taxiLicense50,
        taxiLicense500,
        stickers,
        leaflets,
        billboards,
        designLogo,
        filmAdWithLocalStar,
        mobileApp,
    ]
}