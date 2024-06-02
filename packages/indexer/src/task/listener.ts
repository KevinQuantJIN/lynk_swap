import { sepolia } from 'viem/chains';
import { MAIN_ROUTER, MESSAGERS } from '../constant';
import { Chain, Hex, createPublicClient, http, parseAbiItem } from 'viem';
import { PrismaClient } from '@prisma/client';

export function startListen() {
  const prisma = new PrismaClient();

  const sepoliaClient = createPublicClient({
    chain: sepolia,

    transport: http(MAIN_ROUTER.url),
  });

  sepoliaClient.watchEvent({
    address: MAIN_ROUTER.address as Hex,
    event: parseAbiItem(
      'event InvokeSwap(bytes32 indexed messageIdA, bytes32 indexed messageIdB, bytes32 indexed messageIdC, address fromToken, uint256 fromAmount, uint256 feeAmount)',
    ),
    fromBlock: BigInt(MAIN_ROUTER.startBlock),
    onLogs: (logs) => {
      logs.forEach(async (l) => {
        try {
          console.log('l: ', l);
          const tx = await sepoliaClient.getTransactionReceipt({ hash: l.transactionHash });
          await prisma.swap.upsert({
            where: { transactionHash: tx.transactionHash },
            update: {},
            create: {
              transactionHash: tx.transactionHash,
              userAddress: tx.from,
              fromChainId: sepoliaClient.chain.id,
              fromTokenAddress: l.args.fromToken!,
              fromTokenAmount: l.args.fromAmount!.toString(),
              fees: l.args.feeAmount!.toString(),
            },
          });
          await prisma.deal.upsert({
            where: { messageId: l.args.messageIdA },
            update: {},
            create: {
              swapTransactionHash: tx.transactionHash,
              messageId: l.args.messageIdA!,
              status: 'Pending',
              chainId: 80002,
            },
          });

          await prisma.deal.upsert({
            where: { messageId: l.args.messageIdB },
            update: {},
            create: {
              swapTransactionHash: tx.transactionHash,
              messageId: l.args.messageIdB!,
              status: 'Pending',
              chainId: 84532,
            },
          });

          await prisma.deal.upsert({
            where: { messageId: l.args.messageIdC },
            update: {},
            create: {
              swapTransactionHash: tx.transactionHash,
              messageId: l.args.messageIdC!,
              status: 'Pending',
              chainId: 43113,
            },
          });
        } catch (e) {
          console.error(e);
        }
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  MESSAGERS.forEach((m) => {
    const client = createPublicClient({
      chain: m.chain as Chain,
      transport: http(m.url),
    });

    client.watchEvent({
      address: m.address as Hex,
      event: parseAbiItem(
        'event OrderFilled(bytes32 messageId, address fromToken, uint256 fromAmount, address toToken, uint256 toAmount)',
      ),
      fromBlock: BigInt(m.startBlock),
      onLogs: (logs) => {
        console.log('find logs', logs);

        try {
          logs.forEach(async (l) => {
            const tx = await client.getTransactionReceipt({ hash: l.transactionHash });
            await prisma.deal.update({
              where: { messageId: l.args.messageId! },
              data: {
                transactionHash: tx.transactionHash,
                fromTokenAddress: l.args.fromToken!,
                fromTokenAmount: l.args.fromAmount!.toString(),
                toTokenAddress: l.args.toToken!,
                toTokenAmount: l.args.toAmount!.toString(),
                status: 'Success',
              },
            });
          });
        } catch (e) {
          console.error(e);
        }
      },
      onError(error) {
        console.log(error);
      },
    });
  });
}
