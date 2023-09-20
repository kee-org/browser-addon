import { utils } from "../common/utils";
import { KeeLog } from "../common/Logger";

/*
SRP functions. Currently includes only SRPc, a SRP client implementation.

Inspiration and some code comes from
http://code.google.com/p/srp-js/ used under a BSD license.
*/

function modPow (base: bigint, exponent: bigint, modulus: bigint) {
	let result = 1n;

	if (modulus === 0n && exponent > 0n) {
		throw new Error("Divide by zero");
	}

	while (exponent > 0n) {
		if (exponent & 1n) {
			result = (result * base) % modulus;
		}

		exponent = exponent >> 1n;
		if (exponent > 0n) {
			base = (base * base) % modulus;
		}
	}

	return BigInt(result);
};

export class SRPc {
    public Astr: string;
    private A: bigint;
    private a: bigint;
    private S: bigint;
    private K: string;
    public M: string;
    private M2: string;
    public p: string;
    public I: string;
    private readonly N: bigint;
    private readonly k: bigint;
    private readonly g: bigint;
    public authenticated: boolean;

    constructor() {
        // Variables that will be used in the SRP protocol
        const Nstr =
            "d4c7f8a2b32c11b8fba9581ec4ba4f1b04215642ef7355e37c0fc0443ef756ea2c6b8eeb755a1c723027663caa265ef785b8ff6a9b35227a52d86633dbdfca43";
        this.N = BigInt(`0x${Nstr}`);
        this.g = BigInt(2);
        this.k = BigInt("0xb7867f1299da8cc24ab93e08986ebc4d6a478ad0");
        this.a = utils.BigIntFromRandom(32);
        this.A = modPow(this.g, this.a, this.N);
        while (this.A % this.N == 0n) {
            this.a = utils.BigIntFromRandom(32);
            this.A = modPow(this.g, this.a, this.N);
        }
        this.Astr = this.A.toString(16).toUpperCase();
        this.S = null;
        this.K = null;
        this.M = null;
        this.M2 = null;
        this.authenticated = false;
        this.I = null;
        this.p = null;
    }

    setup(username: string) {
        this.I = username;
    }

    // Receive login salts from the server, promise to start calculations
    receiveSalts(s: string, Bstr: string) {
        if (this.p == null) {
            throw new Error("p not set");
        }
        return this.calculations(s, Bstr, this.p);
    }

    // Calculate S, M, and M2
    private calculations(s: string, ephemeral: string, pass: string) {
        //S -> C: s | B
        const B = BigInt(`0x${ephemeral}`);
        const Bstr = ephemeral;
        return Promise.all([utils.hash(this.Astr + Bstr), utils.hash(s + pass)])
            .then(digests => {
                // u = H(A,B)
                const u = BigInt(`0x${digests[0]}`);
                // x = H(s, p)
                const x = BigInt(`0x${digests[1]}`);
                //S = (B - kg^x) ^ (a + ux)
                const kgx = this.k * modPow(this.g, x, this.N);
                const aux = this.a + (u * x);
                this.S = modPow(B - kgx, aux, this.N);

                // Calculate the auth hash we will send to the server (M) and the one we expect back in the next step (M2)
                const Mstr = (this.A.toString(16) + B.toString(16) + this.S.toString(16)).toUpperCase();
                return utils.hash(Mstr);
            })
            .then(digest => {
                // M = H(A, B, S)
                this.M = digest;
                return utils.hash(this.A.toString(16).toUpperCase() + this.M + this.S.toString(16).toUpperCase());
            })
            .then(digest => {
                //M2 = H(A, M, S)
                this.M2 = digest;
            });
    }

    // Receive M2 from the server and verify it
    confirmAuthentication(M2server: string) {
        if (M2server.toLowerCase() == this.M2.toLowerCase()) {
            this.authenticated = true;
            this.success();
        } else KeeLog.error("Server key does not match");
    }

    success() {
        return;
    }

    // When someone wants to use the session key for encrypting traffic, they can
    // access the key with this function. It's a deferred calculation to reduce impact
    // of DOS attacks (which would generally fail the connection attempt before getting this far)
    key() {
        if (this.K == null) {
            if (this.authenticated) {
                return utils.hash(this.S.toString(16).toUpperCase()).then(digest => {
                    this.K = digest.toLowerCase();
                    return this.K;
                });
            } else {
                KeeLog.error("User has not been authenticated.");
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(this.K);
        }
    }
}
