import {randomBytes} from "node:crypto";

// Supplied by Awesome Stickz on 2024-12-23
function getWeightedCryptoRandomElement<T>(elements: { value: T; weight: number }[]) {
    if (!elements.length) return;

    const totalWeight = elements.reduce((acc, element) => acc + element.weight, 0);

    // Generate 8 random bytes (64 bits)
    const generatedRandomBytes = randomBytes(8);
    // Convert the random bytes to an unsigned big-endian number
    const randomBENumber = generatedRandomBytes.readBigUInt64BE(0);

    const randomWeightedNumber = Number(randomBENumber % BigInt(totalWeight));

    let cumulativeWeight = 0;

    for (const element of elements) {
        cumulativeWeight += element.weight;

        if (cumulativeWeight > randomWeightedNumber) return element.value;
    }
}

// Audit.
function generateParticipants(n: number): { value: number; weight: number }[] {
    const participants: { value: number; weight: number }[] = [];

    for (let i = 0; i < n; i++) {
        participants.push({
            value: i,
            weight: 1
        });
    }

    return participants;
}

function simulateDrawings(n: number, drawings: number): number[] {
    const participants = generateParticipants(n);
    const winners: number[] = Array(n).fill(0);
    for (let i = 0; i < drawings; i++) {
        const winner = getWeightedCryptoRandomElement(participants);
        winners[winner]++;
    }
    for (let i = 0; i < winners.length; i++) {
        winners[i] = winners[i] / drawings;
    }
    return winners;
}

for (let i = 0; i < 10; i++) {
    console.log(simulateDrawings(10, 10));
}
