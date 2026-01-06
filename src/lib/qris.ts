export const QRIS_STATIC_PAYLOAD = "00020101021126610014COM.GO-JEK.WWW01189360091435229947160210G5229947160303UMI51440014ID.CO.QRIS.WWW0215ID10254215767580303UMI5204899953033605802ID5922KOU, Digital & Kreatif6009SAMARINDA61057510462070703A0163043E6B"

// Helper to calculate CRC16 (CCITT 0xFFFF)
function convertCRC16(str: string): string {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    let hex = (crc & 0xFFFF).toString(16).toUpperCase();
    if (hex.length === 3) hex = "0" + hex;
    // ensure 4 chars just in case, though logic guarantees 3 at worst with padding above or 4
    if (hex.length < 4) hex = hex.padStart(4, '0');
    return hex;
}

export function generateQrisString(originalPayload: string, amount: number) {
    if (!originalPayload || originalPayload.length < 4) return originalPayload;

    // 1. Remove CRC (last 4 chars)
    // The CRC is always the last 4 characters of the standard QRIS string.
    let qris = originalPayload.slice(0, -4);

    // 2. Change Tag 01 (Static vs Dynamic)
    // 010211 -> 010212
    // We expect this tag specifically near the beginning.
    // Replace only the first occurrence which should be the version tag.
    qris = qris.replace("010211", "010212");

    // 3. Inject Amount (Tag 54) before Country Code (Tag 58)
    // Find absolute position of "5802ID"
    const delimiter = "5802ID";
    const splitIndex = qris.indexOf(delimiter);

    if (splitIndex === -1) {
        console.error("Invalid QRIS payload: 5802ID not found");
        return originalPayload;
    }

    const part1 = qris.substring(0, splitIndex);
    const part2 = qris.substring(splitIndex);

    // Amount Tag construction
    const amountStr = amount.toString();
    const tag54 = "54" + amountStr.length.toString().padStart(2, '0') + amountStr;

    // Reassemble
    let fix = part1 + tag54 + part2;

    // 4. Recalculate CRC using Tag 63
    // The string currently ends with the data. We need to append the new CRC.
    fix += convertCRC16(fix);

    return fix;
}
