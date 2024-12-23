import {randomBytes} from "node:crypto";
import {MathNumericType, max, mean, min, std} from "mathjs";
import {randomInt} from "node:crypto";

// Supplied by Awesome Stickz on 2024-12-23
function getWeightedCryptoRandomElement<T>(elements: { value: T; weight: number }[]) {
    if (!elements.length) return;

    const totalWeight = elements.reduce((acc, element) => acc + element.weight, 0);

    // Generate 8 random bytes (64 bits)
    // const generatedRandomBytes = randomBytes(8);
    // Convert the random bytes to an unsigned big-endian number
    // const randomBENumber = generatedRandomBytes.readBigUInt64BE(0);

    // const randomWeightedNumber = Number(randomBENumber % BigInt(totalWeight));
    const randomWeightedNumber = randomInt(totalWeight);

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

function analyseDrawings(n: number, drawings: number): void {
    console.log(`Simulating ${n} participants in ${drawings} drawings`);
    const simulation = simulateDrawings(n, drawings);
    const stats: any = {
        expected: 1 / n,
        mean: mean(simulation),
        min: min(simulation),
        max: max(simulation),
        range: max(simulation) - min(simulation),
        stddev: std(...simulation)
    };
    stats.stddev_rel = stats.stddev / stats.expected;
    stats.range = stats.max - stats.min;
    stats.range_rel = stats.range / stats.expected;
    stats.mean_err = stats.mean - stats.expected;
    stats.mean_err_rel = stats.mean_err / stats.expected;
    console.log(stats);
    console.log("\n");
}

for (let i = 2; i <= 1000; i = Math.max(i + 1, i * 1.2)) {
    const p = Math.floor(i);
    analyseDrawings(p, p * 100e3);
}
