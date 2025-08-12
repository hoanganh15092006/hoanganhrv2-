import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  paymentCredentialOf,
} from "https://deno.land/x/lucid/mod.ts";

// Load env vars
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

// Init Lucid
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    BLOCKFROST_API_KEY,
  ),
  "Preview",
);

lucid.selectWalletFromSeed(SEED_PHRASES);

// Wallet info
const addr = await lucid.wallet.address();
const publicKeyHash = paymentCredentialOf(addr).hash;

// Load validator
const script: SpendingValidator = {
  type: "PlutusV2",
  script: CBORHEX,
};
const contractAddress = lucid.utils.validatorToAddress(script);

// Datum schema 
const DatumSchema = Data.Object({
  owner: Data.String,
});
type DatumType = Data.Static<typeof DatumSchema>;

// Redeemer schema 
const RedeemerSchema = Data.Object({
  message: Data.String,
});
type RedeemerType = Data.Static<typeof RedeemerSchema>;

// Unlock function
async function unlockAssets(redeemerValue: RedeemerType): Promise<TxHash> {
  // Tìm UTxO 
  const utxos = await lucid.utxosAt(contractAddress);
  const targetUtxo = utxos.find((u) => {
    try {
      const datumObj = Data.from<DatumType>(
        u.datum!,
        DatumSchema,
      );
      return datumObj.owner === publicKeyHash;
    } catch {
      return false;
    }
  });

  if (!targetUtxo) {
    throw new Error("Không tìm thấy UTxO nào phù hợp để unlock");
  }

  const redeemer = Data.to<RedeemerType>(redeemerValue, RedeemerSchema);

  // Build tx
  const tx = await lucid
    .newTx()
    .collectFrom([targetUtxo], redeemer)
    .attachSpending(validator)
    .addSigner(addr)
    .complete();

  // Sign & submit
  const signedTx = await tx.sign().commit();
  return signedTx.submit();
}

// Main
async function main() {
  try {
    const txHash = await unlockAssets({
      message: "Hello unlock!",
    });
    await lucid.awaitTx(txHash);

    console.log(`Tx unlock hash: ${txHash}`);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
