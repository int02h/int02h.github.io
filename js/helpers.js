export function formatAmount(amount) {
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`
    }

    return amount.toFixed(0);
}

export function formatPrice(price) {
    if (price >= 1000000) {
        return `€${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
        return `€${price.toFixed(0)}`
    }
    return `€${price.toFixed(2)}`
}
