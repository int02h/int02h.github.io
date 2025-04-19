import {trips, createRandomTaxiTrip, placeOfficeObject, placeGarageObject, placeFactoryObject} from './map.js';
import {formatAmount, formatPrice} from './helpers.js';
import {createEffects} from './effects.js';
import {createGameEvents} from './game-events.js';
import {Popup} from "./classes/Popup.js";

const tickPerSecond = 10

/**
 * Global game state
 */
const defaultCtx = {
    /***** SECTION: params *****/
    // How many rides happen per second
    rider_per_second: 0,
    // Duration of a ride. During this time the driver is not available.
    ride_duration_s: 5,

    /***** SECTION: counters *****/
    total_ride_count: 0,
    total_money: 0,
    // Amount of available riders waiting for a ride. This is a supply part of supply-and-demand
    rider_count_raw: 0,
    // Available rider count that is displayed in the UI. Contains integer numbers.
    // This value is read-only and is calculated from rider_count_raw on every tick
    rider_count: 0,
    // Amount of hired drivers
    total_driver_count: 1,
    // Amount of drivers in the idle state. Drivers are available to take rides.
    available_driver_count: 1,
    // The maximum amount of drivers that can be hired. This is a limit set by the taxi license.
    allowed_driver_count: 1,

    /***** SECTION: flags *****/
    has_dispatcher: false,

    /***** SECTION: prices *****/
    ride_price: 1.99,
    hire_driver_price: 10,

    /***** SECTION: effects and events *****/
    applied_effects: [],
    occurred_events: [],

    /***** SECTION: time and timestamps *****/
    // The amount of ticks that have passed since the game started.
    tick: 0,
    // The array of timestamps to track driver availability. If the driver is riding with a passenger, then
    // the corresponding value is added to the array denoting the time when the driver will be available again.
    driver_available_at: [],
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

let popup

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

    popup = new Popup({
        popupOverlay: document.getElementById('popup-overlay'),
        popupContent: document.getElementById('popup-content'),
        onOpenModal: pauseGame,
        onCloseModal: resumeGame,
    });

    if (localStorage.game_ctx) {
        ctx = JSON.parse(localStorage.game_ctx)
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
        popup.showPopup(nextEventToOccur.getContent(ctx))
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

        for (let i = 0; i < rideCount; i++) {
            trips.push(createRandomTaxiTrip('taxi'));
        }
    }
}

function canStartRide() {
    return ctx.available_driver_count > 0 && ctx.rider_count > 0
}

function saveGame() {
    localStorage.game_ctx = JSON.stringify(ctx)
}

function resetGame() {
    ctx = defaultCtx;
    saveGame();
    localStorage.game_map = "";
    location.reload();
}

function buildOffice() {
    placeOfficeObject(20, 20);
}

function buildGarage() {
    placeGarageObject(3, 1);
    placeGarageObject(7, 1);
    placeGarageObject(11, 1);
}

function buildFirstFactory() {
    placeFactoryObject(30,20, 0)
}

function buildSecondFactory() {
    placeFactoryObject(20,30, 2)
}

function test() {
    if (false) {
        buildOffice();
        buildGarage();
        buildFirstFactory();
        buildSecondFactory();
    }
    pauseGame();
}

function pauseGame() {
    console.log("pause game");
    clearInterval(gameTickIntervalId);
}

function resumeGame() {
    console.log("resume game");
    onGameTick();
    gameTickIntervalId = setInterval(onGameTick, 1000 / tickPerSecond);
}

document.addEventListener('DOMContentLoaded', async () => {
    init();

    document.getElementById('tickButton').addEventListener('click', test);
    document.getElementById('resetGameButton').addEventListener('click', resetGame);
});