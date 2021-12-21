// based on https://pl.wikipedia.org/wiki/Numer_identyfikacji_podatkowej

export function validateNip(nip) {
    const weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const digitArray = nip.split('');

    const checksum =
        weight.reduce((prev, curr, index) => {
            return prev + curr * digitArray[index];
        }, 0) % 11;

    console.log(checksum);
    console.log(parseInt(digitArray[digitArray.length - 1]));

    if (checksum !== parseInt(digitArray[digitArray.length - 1])) {
        return false;
    }

    return true;
}
