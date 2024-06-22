const createEffects = function(ctx) {

    const driver = new function() {
        this.id = "driver"
        this.getTitle = function(ctx) { return `Hire driver ${formatPrice(ctx.hire_driver_price)}`}
        this.isVisible = function(ctx) { return true }
        this.canApply = function(ctx) { return ctx.total_money >= ctx.hire_driver_price }
        this.apply = function(ctx) {
            ctx.total_money -= ctx.hire_driver_price
            ctx.hire_driver_price *= 1.1
            ctx.available_driver_count++
            ctx.total_driver_count++
        }
    }

    const dispatcher = new function() {
        const price = 25.00

        this.id = "dispatcher"
        this.getTitle = function(ctx) { return `Hire dispatcher ${formatPrice(price)}`}
        this.isVisible = function (ctx) { return !ctx.has_dispatcher && ctx.total_driver_count >= 2 },
        this.canApply = function (ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function (ctx) {
            ctx.applied_effects.push(this.id)
            ctx.has_dispatcher = true
            ctx.total_money -= price
        }
    };

    const stickers = new function() {
        const price = 50.00

        this.id = "stickers"
        this.getTitle = function(ctx) { return `Stickers on bus stops ${formatPrice(price)}` },
        this.isVisible = function (ctx) { return !ctx.applied_effects.includes(this.id) && ctx.total_driver_count >= 3 },
        this.canApply = function (ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function (ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second = 0.7
            ctx.total_money -= price
        }
    };

    const leaflets = new function() {
        const price = 100.00
        
        this.id = "leaflets",
        this.getTitle = function(ctx) { return `Distribute leaflets ${formatPrice(price)}` },
        this.isVisible = function (ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(stickers.id) },
        this.canApply = function (ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function (ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second *= 2
            ctx.total_money -= price
        }
    };

    const billboards = new function() {
        const price = 1000.00

        this.id = "billboards",
        this.getTitle = function(ctx) { return `Install billboards ${formatPrice(price)}` },
        this.isVisible = function (ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(leaflets.id) },
        this.canApply = function (ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function (ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second *= 4
            ctx.total_money -= price
        }
    };

    const mobileApp = new function() {
        const price = 5000.00

        this.id = "mobile_app",
        this.getTitle = function(ctx) { return `Develop mobile app ${formatPrice(price)}` },
        this.isVisible = function (ctx) { return !ctx.applied_effects.includes(this.id) && ctx.applied_effects.includes(billboards.id) },
        this.canApply = function (ctx) { return ctx.total_money >= price && this.isVisible(ctx) }
        this.apply = function (ctx) {
            ctx.applied_effects.push(this.id)
            ctx.rider_per_second *= 2
            ctx.total_money -= price
        }
    };

    return [
        driver,
        dispatcher,
        stickers,
        leaflets,
        billboards,
        mobileApp
    ]
}