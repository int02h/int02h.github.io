import {formatPrice} from './helpers.js';

export const createEffects = function(ctx) {

    const driver = new function() {
        this.id = "driver"
        this.getTitle = function(ctx) { return `Hire driver ${formatPrice(ctx.hire_driver_price)}`}
        this.isVisible = function(ctx) { return ctx.applied_effects.includes(taxiLicense10.id) }
        this.canApply = function(ctx) { return ctx.total_money >= ctx.hire_driver_price && ctx.total_driver_count < ctx.allowed_driver_count }
        this.apply = function(ctx) {
            ctx.total_money -= ctx.hire_driver_price
            ctx.hire_driver_price *= 1.1
            ctx.available_driver_count++
            ctx.total_driver_count++
        }
    }

    const dispatcher = new function() {
        const price = 250.00

        this.id = "dispatcher"
        this.getTitle = function(ctx) { return `Hire dispatcher ${formatPrice(price)}`}
        this.isVisible = function(ctx) { return !ctx.has_dispatcher && ctx.total_driver_count >= 2 }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.has_dispatcher = true
            ctx.total_money -= price
        }
    };

    const taxiLicense10 = new function() {
        const price = 70
        const allowedAmount = 10

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function(ctx) { return `Buy license to hire up to ${allowedAmount} drivers ${formatPrice(price)}`}
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    const taxiLicense50 = new function() {
        const price = 500
        const allowedAmount = 50

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function(ctx) { return `Buy license for ${allowedAmount} drivers ${formatPrice(price)}`}
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(taxiLicense10.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    const taxiLicense500 = new function() {
        const price = 8000
        const allowedAmount = 500

        this.id = `taxi_license_${allowedAmount}`
        this.getTitle = function(ctx) { return `Buy license for ${allowedAmount} drivers ${formatPrice(price)}`}
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(taxiLicense50.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.allowed_driver_count = allowedAmount
            ctx.total_money -= price
        }
    }

    const stickers = new function() {
        const price = 50.00

        this.id = "stickers"
        this.getTitle = function(ctx) { return `Stickers on bus stops ${formatPrice(price)}` },
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.total_driver_count >= 3 }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 1
            ctx.total_money -= price
        }
    };

    const leaflets = new function() {
        const price = 100.00

        this.id = "leaflets"
        this.getTitle = function(ctx) { return `Distribute leaflets ${formatPrice(price)}` }
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(stickers.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 1.8
            ctx.total_money -= price
        }
    };

    const billboards = new function() {
        const price = 1000.00

        this.id = "billboards"
        this.getTitle = function(ctx) { return `Install billboards ${formatPrice(price)}` }
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(leaflets.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 5
            ctx.total_money -= price
        }
    };

    const mobileApp = new function() {
        const price = 50_000.00

        this.id = "mobile_app"
        this.getTitle = function(ctx) { return `Develop mobile app ${formatPrice(price)}` }
        this.isVisible = function(ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(billboards.id) }
        this.canApply = function(ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function(ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 60
            ctx.total_money -= price
        }
    };

    return [
        driver,
        dispatcher,
        taxiLicense10,
        taxiLicense50,
        taxiLicense500,
        stickers,
        leaflets,
        billboards,
        mobileApp,
    ]
}