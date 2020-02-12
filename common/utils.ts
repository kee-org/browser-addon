

declare const publicSuffixList;
declare const punycode;
declare const pslData;

export class Utils {

    private pslInitialised = false;

    constructor ()
    {
    }

    /*******************************************
    / General utility functions
    /*******************************************/

    versionAsInt (versionArray)
    {
        let value = 0;
        for ( let i = 0; i < versionArray.length; i++) {
            value = (value * 256) + versionArray[i];
        }

        return value;
    }

    versionAsArray (versionInt)
    {
        const byteArray = [0, 0, 0];

        for (let i = byteArray.length -1; i >= 0; i--) {
            const byte = versionInt & 0xff;
            byteArray[i] = byte;
            versionInt = (versionInt - byte) / 256;
        }

        return byteArray;
    }

    versionAsString (versionInt)
    {
        let value = "";
        const versionArray = this.versionAsArray(versionInt);
        for ( let i = 0; i < versionArray.length; i++) {
            if (i > 0)
                value += ".";
            value += versionArray[i].toString();
        }

        return value;
    }

    // return the two-digit hexadecimal code for a byte
    toHexString (charCode)
    {
        return ("0" + charCode.toString(16)).slice(-2);
    }

    BigIntFromRandom (byteCount)
    {
        const bytes = new Uint8Array(byteCount);
        window.crypto.getRandomValues(bytes);
        const hex = Array.from(bytes).map(this.toHexString).join("");
        return BigInteger.parse(hex, 16);
    }

    // input can be either UTF8 formatted string or a byte array
    hash<T extends string | Uint8Array> (data: T, outFormat: string = "hex", algorithm: string = "SHA-256")
    {
        let inBuffer: any;

        if (typeof(data) == "string" )
            inBuffer = new TextEncoder().encode(data);
        else
            inBuffer = data;

        return crypto.subtle.digest({name: algorithm}, inBuffer).then(outBuffer => {
            if (outFormat == "base64") {
                return utils.byteArrayToBase64(outBuffer);
            } else {
                return Array.from((new Uint8Array(outBuffer))).map(this.toHexString).join("");
            }
        });
    }

    intToByteArray (int) {
        const byteArray = [0, 0, 0, 0];

        for ( let index = byteArray.length -1; index >= 0; index-- ) {
            const byte = int & 0xff;
            byteArray [ index ] = byte;
            int = (int - byte) / 256 ;
        }

        return byteArray;
    }

    intArrayToByteArray (intArray) {
        const byteArray = new Array(intArray.length*4);

        for ( let index = 0; index < intArray.length; index ++ ) {
            let int = intArray[index];
            for ( let j = 3; j >= 0; j-- ) {
                const byte = int & 0xff;
                byteArray [ (index * 4) + j ] = byte;
                int = (int - byte) / 256 ;
            }
        }

        return byteArray;
    }

    stringToByteArray (str)
    {
        const e = new TextEncoder();
        return e.encode(str);
    }

    // A variation of base64toByteArray which allows us to calculate a HMAC far
    // more efficiently than with seperate memory buffers
    base64toByteArrayForHMAC (input, extraLength, view = null) {
        const binary = atob(input);
        const len = binary.length;
        let offset = 0;
        if (!view)
        {
            const buffer = new ArrayBuffer(len + extraLength);
            view = new Uint8Array(buffer);
            offset = 20;
        }
        for (let i = 0; i < len; i++)
        {
            view[(i+offset)] = binary.charCodeAt(i);
        }
        return view;
    }

    base64toByteArray (input) {
        const binary = atob(input);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++)
        {
            view[i] = binary.charCodeAt(i);
        }
        return view;
    }

    byteArrayToBase64 (arrayBuffer): string {
        let base64 = "";
        const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const bytes = new Uint8Array(arrayBuffer);
        const byteLength = bytes.byteLength;
        const byteRemainder = byteLength % 3;
        const mainLength = byteLength - byteRemainder;
        let a;
        let b;
        let c;
        let d;
        let chunk;

        // Main loop deals with bytes in chunks of 3
        for (let i = 0; i < mainLength; i = i + 3)
        {
            // Combine into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
            c = (chunk & 4032) >>  6; // 4032 = (2^6 - 1) << 6
            d = chunk & 63; // 63 = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1)
        {
            chunk = bytes[mainLength];

            a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3) << 4; // 3 = 2^2 - 1

            base64 += encodings[a] + encodings[b] + "==";
        } else if (byteRemainder == 2)
        {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

            a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15) << 2; // 15 = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + "=";
        }

        return base64;
    }

    hexStringToByteArray (hexString, byteArray = null) {
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }
        const numBytes = hexString.length / 2;
        if (!byteArray)
            byteArray = new Uint8Array(numBytes);
        for (let i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        return byteArray;
    }

    newGUID ()
    {
        const lut = []; for (let i=0; i<256; i++) { lut[i] = (i<16 ? "0": "")+(i).toString(16); }

        const dvals = new Uint32Array(4);
        window.crypto.getRandomValues(dvals);
        const d0 = dvals[0];
        const d1 = dvals[1];
        const d2 = dvals[2];
        const d3 = dvals[3];
        return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+"-"+
        lut[d1&0xff]+lut[d1>>8&0xff]+"-"+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+"-"+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+"-"+lut[d2>>16&0xff]+lut[d2>>24&0xff]+    lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    }


    base64urlDecode (input: string) {
        // I don't see why we do any replacements here. Seems a pointless waste of cycles. Needs testing and removal if I'm right.
        return atob(input.replace(/-/g, "+").replace(/_/g, "/"));
    }

    binaryToByteArray (binary: string): Uint8Array {
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return view;
    }

    base64urltoByteArray (input: string) {
        const binary = this.base64urlDecode(input);
        return this.binaryToByteArray(binary);
    }

    public get psl () {
        if (!publicSuffixList) throw new Error("publicSuffixList library not present");
        if (!this.pslInitialised) {
            publicSuffixList.parse(pslData.text, punycode.toASCII);
            this.pslInitialised = true;
        }
        return publicSuffixList;
    }
}

export const utils = new Utils();
