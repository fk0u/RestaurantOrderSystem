
const QRIS_PAYLOAD = "00020101021126610014COM.GO-JEK.WWW01189360091435229947160210G5229947160303UMI51440014ID.CO.QRIS.WWW0215ID10254215767580303UMI5204899953033605802ID5922KOU, Digital & Kreatif6009SAMARINDA61057510462070703A0163043E6B";

function convertCRC16(str) {
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
    if (hex.length < 4) hex = hex.padStart(4, '0');
    return hex;
}

function generateQrisString(originalPayload, amount) {
    console.log("Original:", JSON.stringify(originalPayload));
    if (!originalPayload || originalPayload.length < 4) return originalPayload;

    let qris = originalPayload.slice(0, -4);
    let step1 = qris.replace("010211", "010212");

    const delimiter = "5802ID";
    const parts = step1.split(delimiter);

    console.log("Split parts:", parts.length);
    console.log("Part 0:", JSON.stringify(parts[0]));
    console.log("Part 1:", JSON.stringify(parts[1]));

    if (parts.length !== 2) {
        console.error("Invalid QRIS payload: 5802ID not found");
        return originalPayload;
    }

    const amountStr = amount.toString();
    const tag54 = "54" + amountStr.length.toString().padStart(2, '0') + amountStr;

    let fix = parts[0] + tag54 + delimiter + parts[1];

    fix += convertCRC16(fix);

    return fix;
}

const result = generateQrisString(QRIS_PAYLOAD, 119880);
console.log("Result:", JSON.stringify(result));
