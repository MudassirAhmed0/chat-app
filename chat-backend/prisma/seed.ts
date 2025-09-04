import {
  PrismaClient,
  ConversationType,
  MembershipRole,
  DeliveryState,
  MessageType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // clean slate (dev only; comment out if you don't want deletes)
  await prisma.reaction.deleteMany();
  await prisma.messageStatus.deleteMany();
  await prisma.message.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();

  // users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      name: 'Alice',
      passwordHash: 'hash:alice', // replace later with real hash
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob',
      name: 'Bob',
      passwordHash: 'hash:bob',
    },
  });

  // DM conversation
  const dmKey = [alice.id, bob.id].sort().join(':');
  const convo = await prisma.conversation.create({
    data: {
      type: ConversationType.DM,
      dmKey,
      memberships: {
        create: [
          { userId: alice.id, role: MembershipRole.MEMBER },
          { userId: bob.id, role: MembershipRole.MEMBER },
        ],
      },
    },
    include: { memberships: true },
  });

  // messages
  const m1 = await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderId: alice.id,
      type: MessageType.TEXT,
      content: 'Hey Bob! 👋',
    },
  });

  const m2 = await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderId: bob.id,
      type: MessageType.TEXT,
      content: 'Yo Alice! How are you?',
    },
  });

  const m3 = await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderId: alice.id,
      type: MessageType.TEXT,
      content: "All good — let's ship this chat app 🚀",
    },
  });

  // statuses per user
  // m1 (from Alice): Bob has delivered+read
  await prisma.messageStatus.createMany({
    data: [
      {
        messageId: m1.id,
        userId: alice.id,
        state: DeliveryState.SENT,
        sentAt: m1.createdAt,
      },
      {
        messageId: m1.id,
        userId: bob.id,
        state: DeliveryState.READ,
        sentAt: m1.createdAt,
        deliveredAt: new Date(),
        readAt: new Date(),
      },
    ],
  });

  // m2 (from Bob): Alice delivered+read
  await prisma.messageStatus.createMany({
    data: [
      {
        messageId: m2.id,
        userId: bob.id,
        state: DeliveryState.SENT,
        sentAt: m2.createdAt,
      },
      {
        messageId: m2.id,
        userId: alice.id,
        state: DeliveryState.READ,
        sentAt: m2.createdAt,
        deliveredAt: new Date(),
        readAt: new Date(),
      },
    ],
  });

  // m3 (from Alice): Bob delivered but not read
  await prisma.messageStatus.createMany({
    data: [
      {
        messageId: m3.id,
        userId: alice.id,
        state: DeliveryState.SENT,
        sentAt: m3.createdAt,
      },
      {
        messageId: m3.id,
        userId: bob.id,
        state: DeliveryState.DELIVERED,
        sentAt: m3.createdAt,
        deliveredAt: new Date(),
      },
    ],
  });

  // reactions example
  await prisma.reaction.create({
    data: { messageId: m2.id, userId: alice.id, emoji: '👍' },
  });

  console.log('✅ Seed complete:', {
    users: [alice.username, bob.username],
    conversationId: convo.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
