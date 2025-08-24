import {
  Constr,
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  paymentCredentialOf,
  Redeemer,
  UTxO,
  Addresses,
} from "@lucid-evolution/lucid";

// --- Load environment variables ---
const BLOCKFROST_API_KEY = Deno.env.get("BLOCKFROST_API_KEY");
const SEED_PHRASES = Deno.env.get("SEED_PHRASES");
const CBORHEX = Deno.env.get("CBORHEX");

async function unlockAsset() {
  // --- Initialize Lucid with Blockfrost provider for Cardano Preview network ---
  const lucid = await Lucid(
    new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", blockfrostApiKey),
    "Preview"
  );

  lucid.selectWallet.fromSeed(seed);
  const address = await lucid.wallet().address();
  const publicKeyHash = paymentCredentialOf(address).hash;
  console.log("Address:", address);
  console.log("Public key hash:", publicKeyHash);

// --- Load PlutusV2 script ---
  const script: SpendingValidator = {
    type: "PlutusV2",
    script: cborHex
  };
  const scriptAddress = validatorToAddress("Preview", script);
  console.log("Smart contract address: ", scriptAddress);


  const scriptUTxOs = await lucid.utxosAt(scriptAddress);

  
  const utxoun = scriptUTxOs.filter((utxo) => {
    let datum = Data.from<Constr<string>>(utxo.datum ?? '');
    if (datum && (datum.fields[0] === publicKeyHash)) {
      return utxo;
    }
  });
  console.log("UTxOs to unlock: ", utxoun);


  const tx = await lucid
    .newTx()
    .addSigner(address)
    .attach.SpendingValidator(script)
    .collectFrom(utxoun, Data.to(new Constr(0, [fromText("hello world!")])))
    .complete();

  const txSigned = await tx.sign.withWallet().complete();
  const txHash = await txSigned.submit();
  console.log("Transaction created:", txHash);
}

unlockAsset().catch(console.error);
