import { BigNumber, ethers } from "ethers";
import https from "https";
import CryptoJS from "crypto-js";
import { Options } from "./types";
import { hexlify } from "ethers/lib/utils";
import { config } from "./config";

export function fetchData(url: string, options: Options, data?: string) {
  return new Promise((resolve, reject) => {
    const req = https
      .request(url, options, (res) => {
        console.log(`\nResponse code: ${res.statusCode}\n`);

        let data = "";

        res.on("data", (part) => {
          data += part;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (e) => {
        reject(e);
      });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

export function getHeaders(method: string, url: string, data?: string) {
  const apikey = process.env.API_KEY!;
  const timestamp = Date.now().toString() + "000000";
  const payload = data
    ? `${timestamp}${method}${url}${data}`
    : `${timestamp}${method}${url}`;
  const apiSecretBytes = CryptoJS.enc.Base64.parse(process.env.API_SECRET!);
  const hashSignature = CryptoJS.HmacSHA256(payload, apiSecretBytes);
  const signature = CryptoJS.enc.Base64url.stringify(hashSignature);
  return {
    "qredo-api-key": apikey,
    "qredo-api-sig": signature,
    "qredo-api-ts": timestamp,
  };
}

export function getfunctionSignature() {
  const functionName = "transfer";
  const functionParams = ["address", "uint256"];
  const functionId = ethers.utils.id(
    functionName + "(" + functionParams.join(",") + ")"
  );

  return functionId.substring(0, 10);
}

export async function getCreateData(
  tokenAddress: string,
  receiver: string,
  amount: string,
  gasLimit: string
) {
  const receiver32 = complete32BytesWithZeros(receiver);
  const amountBN = BigNumber.from(amount);
  const amount32 = complete32BytesWithZeros(hexlify(amountBN));
  const functionSignature = getfunctionSignature();
  const provider = config.provider;
  const gasPrice = (await provider.getGasPrice()).toString();

  return JSON.stringify({
    from: process.env.QREDO_ADDRESS,
    to: tokenAddress,
    value: "0",
    gasLimit,
    gasPrice,
    chainID: config.chainID,
    note: `sending tokens to ${receiver}`,
    data: functionSignature + receiver32 + amount32,
  });
}

function complete32BytesWithZeros(hexa: string) {
  const zeros =
    "0000000000000000000000000000000000000000000000000000000000000000";
  if (hexa.substring(0, 2) === "0x") {
    hexa = hexa.substring(2);
  }
  return `${zeros.substring(0, 64 - hexa.length)}${hexa}`;
}

export function showApprovals(resp: any) {
  console.table(
    resp.list.map((item: any) => {
      let status;
      switch (item.status) {
        case 1:
          status = "waiting";
          break;
        case 2:
          status = "expired";
          break;
        case 3:
          status = "approved";
          break;
        case 4:
          status = "rejected";
          break;
        default:
          status = "unknown";
          break;
      }
      return { name: item.username, status };
    })
  );
  console.log();
}
