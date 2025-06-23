function toUnixTimestamp(dateInput) {
    // If already a valid Unix timestamp in seconds, return as number
    if (isUnixTimestamp(dateInput)) {
        return Number(dateInput);
    }

    // Try to convert ISO string to Unix timestamp (seconds)
    const parsed = new Date(dateInput);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date: ${dateInput}`);
    }

    return Math.floor(parsed.getTime() / 1000);
}

function isUnixTimestamp(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return false;

    return n > 946684800 && n < 4102444800; // Roughly year 2000–2100
}



module.exports = {
    toUnixTimestamp,
    isUnixTimestamp,
};
