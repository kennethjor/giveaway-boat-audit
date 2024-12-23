import * as crypto from 'crypto';

export function getWeightedCryptoRandomElement<T>(elements: { value: T; weight: number }[]) {
    if (!elements.length) return;

    const totalWeight = elements.reduce((acc, element) => acc + element.weight, 0);

    // Generate 8 random bytes (64 bits)
    const generatedRandomBytes = crypto.randomBytes(8);
    // Convert the random bytes to an unsigned big-endian number
    const randomBENumber = generatedRandomBytes.readBigUInt64BE(0);

    const randomWeightedNumber = Number(randomBENumber % BigInt(totalWeight));

    let cumulativeWeight = 0;

    for (const element of elements) {
        cumulativeWeight += element.weight;

        if (cumulativeWeight > randomWeightedNumber) return element.value;
    }
}
