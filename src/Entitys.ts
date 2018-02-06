namespace wallet.entity
{
    export class UTXO
    {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
        name: string;
        value: number;
    }
    export interface result
    {
        err: boolean, result: any
    }
    export class Detail
    {
        public address: string;
        public height: number;
        public balances: Balance[];
        constructor(address: string, height: number, balances: Balance[])
        {
            this.address = address;
            this.height = height;
            this.balances = balances;
        }
    }
    export interface Balance
    {
        asset: string;
        balance: number;
        name: {
            lang: string;
            name: string;
        }[];
    }
    export enum AssetEnum
    {
        NEO = '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        GAS = '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    }

    export interface Addr
    {
        addr: string;
        firstDate: string;
        lastDate: string;
        firstuse: {
            txid: string;
            blockindex: number;
            blocktime: { $date: number; };
        };
        lastuse: {
            txid: string;
            blockindex: number;
            blocktime: { $date: number; };
        };
        txcount: number;
    }

    export interface Asset
    {
        type: string;
        name: {
            lang: string;
            name: string;
        }[];
        names: string;
        amount: string;
        precision: number;
        owner: string;
        admin: string;
        id: string;
    }

    export class Nep5as
    {
        type: string;
        name: {
            lang: string;
            name: string;
        }[];
        names: string;
        amount: string;
        precision: number;
        owner: string;
        admin: string;
        id: string;
    }

    export class loadKey
    {
        pubkey: Uint8Array;
        prikey: Uint8Array;
        address: string
        constructor(pubkey: Uint8Array, prikey: Uint8Array, address: string)
        {

        }

    }


}