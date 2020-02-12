import { Claim } from "./Claim";

export class JWT {

    public static async verify (sig: string): Promise<{audience: string; claim?: Claim}> {

        const sigParts = sig.split(".");

        if (sigParts.length !== 3) {
            throw new Error("Invalid JWT");
        }

        const claimJSON = window.kee.utils.base64urlDecode(sigParts[1]);
        let claim: Claim;

        try {
            claim = JSON.parse(claimJSON) as Claim;
            if (claim.aud !== "client") {
                return { audience: claim.aud };
            }
        } catch (e) {
            throw new Error("Invalid claim");
        }

        const data = new TextEncoder().encode(sigParts[0] + "." + sigParts[1]).buffer;

        // Untrusted source tells us which key to use but they can't actually pick the key
        // material and most cross-stage server-side breach risks are mitigated by Kee Vault
        // verifying the correct stage is used before passing the token to the browser extension
        let jwk;

        switch (claim.iss) {
            case "idProd": jwk = {
                kty: "EC",
                crv: "P-256",
                x: "O6bWMktjPnOtZAkmz9NzMTO9O2VzuECTa9Jj5g90QSA",
                y: "aIE-8dLpJIoAnLIzH1XDCPxK_asKtIC_fVlSLJyGpcg",
                ext: true
            }; break;
            case "idBeta": jwk = {
                kty: "EC",
                crv: "P-256",
                x: "CinRkFHv6IGNcd52YlzD3BF_WruIMs-6Nn5oI7QmgjU",
                y: "pJ66MRPoCC2MUBFdYyRqGPfw3pZEnPGtHVhvspLTVDA",
                ext: true
            }; break;
            case "idDev": jwk = {
                kty: "EC",
                crv: "P-256",
                x: "mk8--wDgrkPyHttzjQH6jxmjfZS9MaHQ5Qzj53OnNLo",
                y: "XAFQCFwKL7qrV27vI1tug3X2v50grAk_ioieHRe8h18",
                ext: true
            }; break;
            default: throw new Error("Unknown JWT issuer so cannot verify");
        }

        const key = await window.crypto.subtle.importKey(
            "jwk",
            jwk,
            {   //these are the algorithm options
                name: "ECDSA",
                namedCurve: "P-256" //can be "P-256", "P-384", or "P-521"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["verify"] //"verify" for public key import, "sign" for private key imports
        );

        const isValid = await window.crypto.subtle.verify (
            {
                name: "ECDSA",
                hash: {name: "SHA-256"} //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            key, //from generateKey or importKey above
            window.kee.utils.base64urltoByteArray(sigParts[2]), //ArrayBuffer of the signature
            data //ArrayBuffer of the data
        );

        if (!isValid) {
            throw new Error("JWT signature did not verify");
        }

        return { claim, audience: claim.aud };
    }
}
