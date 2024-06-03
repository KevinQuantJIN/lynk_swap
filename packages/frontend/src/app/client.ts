import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "0x";

if (!clientId) {
  throw new Error("No client ID provided");
}
export const myChain = sepolia;


export const client = createThirdwebClient({
  clientId: clientId,
});
