
const tickPerSecond = 10

const defaultCtx = {
    // params
    rider_per_second: 0,
    ride_duration_s: 5,

    // counters
    total_ride_count: 0,
    total_money: 0,
    rider_count_raw: 0,
    rider_count: 0,
    total_driver_count: 1,
    available_driver_count: 1,
    allowed_driver_count: 1,

    // flags
    has_dispatcher: false,

    // timestamps
    driver_available_at: [],

    // prices
    ride_price: 1.99,
    hire_driver_price: 10,

    // effects and events
    applied_effects: [],
    occurred_events: [],

    // time
    tick: 0
}
let ctx = {}

const effects = createEffects()
const gameEvents = createGameEvents()

let riderCountView
let totalRideCountView
let totalMoneyView
let totalDriverCountView
let availableDriverCountView
let allowedDriverCountView
let effectContainerView
let ridePriceView

let inviteRiderButton
let startRideButton

let gameTickIntervalId
let nextEventToOccur

function init() {
    riderCountView = document.getElementById("rider_count")
    totalRideCountView = document.getElementById("total_ride_count")
    totalMoneyView = document.getElementById("total_money")
    totalDriverCountView = document.getElementById("total_driver_count")
    availableDriverCountView = document.getElementById("available_driver_count")
    allowedDriverCountView = document.getElementById("allowed_driver_count")
    inviteRiderButton = document.getElementById("invite_rider_btn")
    startRideButton = document.getElementById("start_ride_btn")
    effectContainerView = document.getElementById("effect_container")
    ridePriceView = document.getElementById("ride_price")

    inviteRiderButton.onclick = inviteRider
    startRideButton.onclick = startRide

    if (localStorage.game_ctx) {
        ctx = JSON.parse(localStorage.game_ctx)
        // temporary migration
        if (ctx.occured_events) {
            ctx.occurred_events = ctx.occured_events
        }
    } else {
        ctx = defaultCtx
    }

    resumeGame()
    setInterval(saveGame, 1000)
}

function onGameTick() {
    if (nextEventToOccur) {
        nextEventToOccur.occur(ctx)
        nextEventToOccur = null
    }

    ctx.rider_count_raw += ctx.rider_per_second / tickPerSecond
    ctx.rider_count = Math.floor(ctx.rider_count_raw)

    const finished = ctx.driver_available_at.filter(info => info.tick <= ctx.tick)
    ctx.driver_available_at = ctx.driver_available_at.filter(info => info.tick > ctx.tick)

    for (const info of finished) {
        ctx.total_ride_count += info.amount
        ctx.available_driver_count += info.amount
        ctx.total_money += info.amount * ctx.ride_price
    }

    if (ctx.has_dispatcher) {
        startRide()
    }

    updateViews()

    nextEventToOccur = gameEvents.find(e => e.isReadyToOccur(ctx))
    if (nextEventToOccur) {
        showPopup(nextEventToOccur.getContent(ctx))
    }

    ctx.tick++
}

function updateViews() {
    riderCountView.innerHTML = `${formatAmount(ctx.rider_count)}`
    totalRideCountView.innerHTML = `${formatAmount(ctx.total_ride_count)}`
    totalMoneyView.innerHTML = `${formatPrice(ctx.total_money)}`

    totalDriverCountView.innerHTML = `${formatAmount(ctx.total_driver_count)}`
    availableDriverCountView.innerHTML = `${formatAmount(ctx.available_driver_count)}`
    allowedDriverCountView.innerHTML = `${formatAmount(ctx.allowed_driver_count)}`

    startRideButton.disabled = !canStartRide()
    startRideButton.hidden = ctx.has_dispatcher
    ridePriceView.innerHTML = `${formatPrice(ctx.ride_price)}`

    // effects
    const effectIdMap = new Map();
    for (const child of effectContainerView.children) { effectIdMap.set(child.id, child) }
    effects.filter(e => e.isVisible(ctx))
        .forEach(e => {
            effectIdMap.delete(e.id)
            let effectView = effectContainerView.querySelector(`#${e.id}`)
            if (!effectView) {
                effectView = document.createElement("button")
                effectView.id = e.id
                effectView.className = 'effect-button'
                effectView.onclick = function() { e.apply(ctx) }
                effectContainerView.appendChild(effectView)
            }
            effectView.innerHTML = e.getTitle(ctx)
            effectView.disabled = !e.canApply(ctx)
        });

    Array.from(effectIdMap.values()).forEach(child => {
        child.remove()
    });
}

function inviteRider() {
    ctx.rider_count_raw += 1
}

function startRide() {
    if (canStartRide()) {
        const rideCount = Math.min(ctx.rider_count, ctx.available_driver_count)
        ctx.rider_count_raw -= rideCount
        ctx.available_driver_count -= rideCount
        const rideDurationTicks = ctx.ride_duration_s * tickPerSecond
        ctx.driver_available_at.push({ tick: ctx.tick + rideDurationTicks, amount: rideCount})
    }
}

function canStartRide() {
    return ctx.available_driver_count > 0 && ctx.rider_count > 0
}

function formatAmount(amount) {
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`
    }

    return amount.toFixed(0);
}

function formatPrice(price) {
    if (price >= 1000000) {
        return `€${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
        return `€${price.toFixed(0)}`
    }
    return `€${price.toFixed(2)}`
}

function saveGame() {
    localStorage.game_ctx = JSON.stringify(ctx)
}

function resetGame() {
    ctx = defaultCtx
    saveGame()
    localStorage.game_map = "";
}

function pauseGame() {
    clearInterval(gameTickIntervalId)
}

function resumeGame() {
    onGameTick()
    gameTickIntervalId = setInterval(onGameTick, 1000 / tickPerSecond)
}

function test() {
}

document.addEventListener('DOMContentLoaded', async () => {
    init();
});