export const functionQuestion = [
  {
    type: "list",
    name: "function",
    message: "SELECT A OPTION",
    choices: [
      "Create a Token Transfer",
      "Get Transfer Approvals",
      "Get Signed Transaction",
      "Send Signed Transaction",
      "Exit",
    ],
  },
];

export const createQuestion = [
  {
    type: "input",
    name: "tokenAddress",
    message: "Token Address:",
  },
  {
    type: "input",
    name: "receiver",
    message: "Receiver Address:",
  },
  {
    type: "input",
    name: "amount",
    message: "Amount:",
  },
  {
    type: "input",
    name: "gasLimit",
    message: "Gas Limit:",
  },
];

export const txIDQuestion = [
  {
    type: "input",
    name: "txID",
    message: "tx ID:",
  },
];

export const signedTxQuestion = [
  {
    type: "input",
    name: "signedTx",
    message: "Signed Tx:",
  },
];
