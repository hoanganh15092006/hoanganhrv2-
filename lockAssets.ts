// Import Mesh SDK core utilities
import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  Address,
  paymentCredentialOf,
} from "https://deno.land/x/lucid/mod.ts";


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
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFROST_API_KEY,
  ),
  "Preview",
);

lucid.selectWalletFromSeed(SEED_PHRASES);


// Get wallet info
const addr = await lucid.wallet.address();
const publicKeyHash = paymentCredentialOf(addr).hash;



// Load PlutusV2 script
const script: SpendingValidator = {
  type: "PlutusV2",
  script: CBORHEX,
};

const contractAddress: Address = lucid.utils.validatorToAddress(script);
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

  // Build transaction
  const tx = await lucid
    .newTx()
    .payToContract(
      contractAddress,
      { inline: inlineDatum },
      { lovelace },
    )
    .complete();

  // Sign transaction
  const signedTx = await tx.sign().complete();

  // Submit transaction
  const txHash = await signedTx.submit();
  return txHash;
}

// Main
async function main() {
  try {
    const datumValue: DatumType = {
      owner: publicKeyHash ??
        "00000000000000000000000000000000000000000000000000000000",
    };

    const txHash = await lockAssets(1_000_000n, datumValue);
    await lucid.awaitTx(txHash);

    console.log(`Tx Hash: ${txHash}`);
    console.log(`Datum: ${JSON.stringify(datumValue)}`);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
