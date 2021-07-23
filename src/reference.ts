import { nanoid } from "nanoid";
import { IAuction } from "./domain/auction";

const auctionTestData : IAuction = {
  isHot: false,
  fee: {
    bidBack: 10,
    royalities: [
      { type: 'creator', value: 10 },
      { type: 'investor', value: 10 },
    ],
    service: 1
  },
  likes: 90,
  createdAt: new Date(),
  updatedAt: new Date(),
  startDt: new Date(),
  expirationDt: new Date(),
  categories: [ 'Digital', 'Photo', 'Classic' ],
  item: {
    id: '60b6c7adf1cd1b3be43aa60e',
    previewImageUrl: "https://gateway.pinata.cloud/ipfs/Qme37jp8q5u12GAs43n3NAKvGoJKoeiQjYVk3MHqiawcCa",
    title: 'Amazing Galaxy',
    tags: [ 'Galaxy', 'Art', 'Creation' ]
  },
  bids: [
    {
      amount: 600,
      createdAt: new Date(),
      tokenSymbol: 'ALGOP',
      type: 'minimum',
    },
    {
      amount: 900,
      createdAt: new Date(),
      tokenSymbol: 'USD',
      type: 'lowest',
      bidder: {
        account: '0x0FR71571GTAHJU',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        createdAt: new Date(),
        name: 'Gleisson',
        role: 'creator',
        updatedAt: new Date(),
        id: "60b6c7adf1cd1b3be43aa60e"
    }
    },
    {
      amount: 400,
      createdAt: new Date(),
      tokenSymbol: 'ETH',
      type: 'highest',
      bidder: {
        account: '0x0FR71571GTAHJU',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        createdAt: new Date(),
        name: 'Lincoln',
        role: 'owner',
        updatedAt: new Date(),
        id: "60b6c7adf1cd1b3be43aa60e"
    }
    }
  ],
  users: [
    {
      account: '0x0FR71571GTAHJU',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      createdAt: new Date(),
      name: 'Gleisson',
      role: 'creator',
      updatedAt: new Date(),
      id: "60b6c7adf1cd1b3be43aa60e"
    },
    {
      account: '0x0FR71571GTAHJU',
      avatar: 'https://randomuser.me/api/portraits/men/.jpg',
      createdAt: new Date(),
      name: 'Lincoln',
      role: 'owner',
      updatedAt: new Date(),
      id: "60b6c7adf1cd1b3be43aa60e"
    }
  ]
};

export { 
  auctionTestData 
}