import { utils } from "../common/utils";
import { KeeLog } from "../common/Logger";

/*
SRP functions. Currently includes only SRPc, a SRP client implementation.

Inspiration and some code comes from
http://code.google.com/p/srp-js/ used under a BSD license.
*/

export class SRPc {
    public Astr: string;
    private A;
    private a;
    private S;
    private K;
    public M;
    private M2;
    public p;
    public I;
    private N;
    private k;
    private g;
    public authenticated: boolean;

    constructor () {
        // Variables that will be used in the SRP protocol
        const Nstr = "d4c7f8a2b32c11b8fba9581ec4ba4f1b04215642ef7355e37c0fc0443ef756ea2c6b8eeb755a1c723027663caa265ef785b8ff6a9b35227a52d86633dbdfca43";
        this.N = BigInteger.parse(Nstr, 16);
        this.g = new BigInteger("2");
        this.k = BigInteger.parse("b7867f1299da8cc24ab93e08986ebc4d6a478ad0", 16);
        this.a = utils.BigIntFromRandom(32);
        this.A = this.g.modPow(this.a, this.N);
        while (this.A.remainder(this.N) == 0) {
            this.a = utils.BigIntFromRandom(32);
            this.A = this.g.modPow(this.a, this.N);
        }
        this.Astr = this.A.toString(16);
        this.S = null;
        this.K = null;
        this.M = null;
        this.M2 = null;
        const that = this;
        this.authenticated = false;
        this.I = null;
        this.p = null;
    }

    setup (username) {
        this.I = username;
    }

    // Receive login salts from the server, promise to start calculations
    receiveSalts (s, Bstr) {
        return this.calculations(s, Bstr, this.p);
    }

    // Calculate S, M, and M2
    calculations (s: string, ephemeral: string, pass: string) {
        //S -> C: s | B
        const B = BigInteger.parse(ephemeral, 16);
        const Bstr = ephemeral;
        return Promise.all([utils.hash(this.Astr + Bstr), utils.hash(s + pass)]).then(digests => {
            // u = H(A,B)
            const u = BigInteger.parse(digests[0], 16);
            // x = H(s, p)
            const x = BigInteger.parse(digests[1], 16);
            //S = (B - kg^x) ^ (a + ux)
            const kgx = this.k.multiply(this.g.modPow(x, this.N));
            const aux = this.a.add(u.multiply(x));
            this.S = B.subtract(kgx).modPow(aux, this.N);

            // Calculate the auth hash we will send to the server (M) and the one we expect back in the next step (M2)
            const Mstr = this.A.toString(16) + B.toString(16) + this.S.toString(16);
            return utils.hash(Mstr);
        }).then(digest => {
            // M = H(A, B, S)
            this.M = digest;
            return utils.hash(this.A.toString(16) + this.M + this.S.toString(16));
        }).then(digest => {
            //M2 = H(A, M, S)
            this.M2 = digest;
        });
    }

    // Receive M2 from the server and verify it
    confirmAuthentication (M2server) {
        if (M2server.toLowerCase() == this.M2.toLowerCase()) {
            this.authenticated = true;
            this.success();
        }
        else
            KeeLog.error("Server key does not match");
    }

    success () {
        return;
    }

    // When someone wants to use the session key for encrypting traffic, they can
    // access the key with this function. It's a deferred calculation to reduce impact
    // of DOS attacks (which would generally fail the connection attempt before getting this far)
    key () {
        if (this.K == null) {
            if (this.authenticated) {
                return utils.hash(this.S.toString(16)).then(digest => {
                    this.K = digest.toLowerCase();
                    return this.K;
                });
            }
            else {
                KeeLog.error("User has not been authenticated.");
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(this.K);
        }

    }
}
