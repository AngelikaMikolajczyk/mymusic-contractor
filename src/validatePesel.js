// based on https://github.com/KKSzymanowski/PESEL/blob/7add36eb61eeb6423cb4f930ae23395a931692fb/src/Pesel.php#L247
// and https://obywatel.gov.pl/pl/dokumenty-i-dane-osobowe/czym-jest-numer-pesel

export function validatePesel(pesel) {
    return validateChecksum(pesel) && validateBirthDateDigits(pesel);
}

function validateChecksum(pesel) {
    const weight = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 1];

    const digitArray = pesel.split('');

    const checksum = digitArray.reduce((prev, curr, index) => {
        return prev + curr * weight[index];
    }, 0);

    if (checksum % 10 !== 0) {
        return false;
    }

    return true;
}

function validateBirthDateDigits(pesel) {
    const [year, month, day] = getYearMonthDate(pesel);

    if (year < 1800 || year > 2299) {
        return false;
    }

    if (month < 1 || month > 12) {
        return false;
    }

    const numberOfDaysInTheMonth = new Date(year, month, 0).getDate();

    if (day < 1 || day > numberOfDaysInTheMonth) {
        return false;
    }

    return true;
}

function getYearMonthDate(pesel) {
    let year = pesel.substring(0, 2);
    let month = pesel.substring(2, 4);
    const day = pesel.substring(4, 6);

    let century = parseInt(pesel.substring(2, 3));
    century += 2;
    century %= 10;
    century = Math.floor(century / 2);
    century += 18;

    year = century + year;

    month = (month % 20).toString().padStart(2, '0');

    return [year, month, day];
}
