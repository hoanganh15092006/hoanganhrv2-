// Import Mesh SDK core utilities
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  Address,
  paymentCredentialOf,
} from "https://deno.land/x/lucid@0.20.12/mod.ts";
// import { generateSeedPhrase } 
//   from "https://deno.land/x/lucid@0.20.12/deno/misc/bip39.ts";
// const mnemonic = generateSeedPhrase();
// console.log("Seed phrase:", mnemonic);
import "https://deno.land/std@0.224.0/dotenv/load.ts";





// Load environment variables
const BLOCKFROST_API_KEY = Deno.env.get("BLOCKFROST_API_KEY");
const SEED_PHRASES = Deno.env.get("SEED_PHRASES");
const CBORHEX = Deno.env.get("CBORHEX");

const missing: string[] = [];
if (!BLOCKFROST_API_KEY) missing.push("BLOCKFROST_API_KEY");
if (!SEED_PHRASES) missing.push("SEED_PHRASES");
if (!CBORHEX) missing.push("CBORHEX");

if (missing.length > 0) {
  throw new Error(`Thiếu biến môi trường: ${missing.join(", ")}`);
}


// Initialize Lucid
const lucid = new Lucid({
  provider: new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFROST_API_KEY,
  ),
});

lucid.selectWalletFromSeed(SEED_PHRASES);


// Get wallet info
const addr = await lucid.wallet.address();
const publicKeyHash = paymentCredentialOf(addr).hash;



// Load PlutusV2 script
const script: SpendingValidator = {
  type: "PlutusV2",
  script: CBORHEX,
};
console.log("Lucid.utils keys:", Object.keys(lucid.utils));
console.log("Type of validatorToAddress:", typeof lucid.utils.validatorToAddress);


const contractAddress = lucid.utils.scriptToAddress(script);



console.log(`SC Address: ${contractAddress}`);



// Define datum schema
const DatumSchema = Data.Object({
  owner: Data.String,
});
type DatumType = Data.Static<typeof DatumSchema>;



// Function to lock assets
async function lockAssets(
  lovelace: bigint,
  datumValue: DatumType,
): Promise<TxHash> {
  const inlineDatum = Data.to<DatumType>(datumValue, DatumSchema);

  const tx = await lucid
    .newTx()
    .payToContract(contractAddress, { Inline: inlineDatum }, { lovelace })
    .commit();

  const signedTx = await tx.sign().commit();
  const txHash = await signedTx.submit();
  return txHash;
}


// Main
async function main() {
  try {
    const datumValue: DatumType = {
      owner: publicKeyHash ??
        "00000000000000000000000000000",
    };

    const txHash = await lockAssets(4_000_000n, datumValue);
    await lucid.awaitTx(txHash);

    console.log(`Tx Hash: ${txHash}`);
    console.log(`Datum: ${JSON.stringify(datumValue)}`);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
