import inquirer from "inquirer";
import { createTx, getApprovals, getSignedTx, sendSignedTx } from "./actions";
import dotenv from "dotenv";
import { functionQuestion } from "./questions";

dotenv.config();

(async () => {
  let answers = { function: "" };
  while (answers.function !== "Exit") {
    answers = await inquirer.prompt(functionQuestion);
    switch (answers.function) {
      case "Create a Token Transfer":
        await createTx();
        break;
      case "Get Transfer Approvals":
        await getApprovals();
        break;
      case "Get Signed Transaction":
        await getSignedTx();
        break;
      case "Send Signed Transaction":
        await sendSignedTx();
        break;
      default:
        break;
    }
  }
})();
