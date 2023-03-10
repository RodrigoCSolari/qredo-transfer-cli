import inquirer from "inquirer";
import { config } from "./config.js";
import { createQuestion, signedTxQuestion, txIDQuestion } from "./questions.js";
import {
  fetchData,
  getCreateData,
  getHeaders,
  showApprovals,
} from "./utils.js";

export async function createTx() {
  let { tokenAddress, receiver, amount, gasLimit } = await inquirer.prompt(
    createQuestion
  );
  const method = "POST";
  const url = "https://api.qredo.network/qapi/v1/transaction";
  const data = await getCreateData(tokenAddress, receiver, amount, gasLimit);
  const options = {
    headers: getHeaders(method, url, data),
    method,
  };

  try {
    const response: any = await fetchData(url, options, data);
    if (response.status === "created") {
      console.log("Transaction Created\n");
      console.log(`Tx ID: ${response.txID}\n`);
    } else {
      console.log(response, "\n");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getApprovals() {
  let { txID } = await inquirer.prompt(txIDQuestion);
  const method = "GET";
  const url = `https://api.qredo.network/qapi/v1/transactions/${txID}/approvals`;
  const options = {
    headers: getHeaders(method, url),
  };
  try {
    const response: any = await fetchData(url, options);
    if (response.list) {
      showApprovals(response);
    } else {
      console.log(response, "\n");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getSignedTx() {
  let { txID } = await inquirer.prompt(txIDQuestion);
  const method = "GET";
  const url = `https://api.qredo.network/qapi/v1/transactions/${txID}/status`;

  const options = {
    headers: getHeaders(method, url),
  };
  try {
    const response: any = await fetchData(url, options);

    if (response.signedTx === "0x") {
      console.log("Waiting For User Approvals\n");
    } else if (response.signedTx) {
      console.log(`Signed Tx: ${response.signedTx}\n`);
    } else {
      console.log(response, "\n");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function sendSignedTx() {
  let { signedTx } = await inquirer.prompt(signedTxQuestion);
  const provider = config.provider;
  const txResponse = await provider.sendTransaction(signedTx);
  txResponse.wait();

  console.log("\n", txResponse);
  console.log(`\nTx Hash: ${config.explorer}/tx/${txResponse.hash}\n`);
}
