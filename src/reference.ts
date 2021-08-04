import { IAuction } from "./domain/auction";
import { ICollection, ICollectionImage } from "./domain/collection";
import { IImage } from "./domain/image";
import { IUser } from "./domain/user";
import { IBid } from "./domain/bid";

const auctionData = (imageID: string, likes: number, isHot: boolean, collection:string, account:string, account2: string) : IAuction => { return {
  isHot: isHot,
  fee: {
    bidBack: 10,
    royalties: [
      { type: 'creator', value: 10 },
      { type: 'investor', value: 10 },
    ],
    service: 1
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  startDt: new Date(),
  expirationDt: new Date(),
  categories: ['Digital', 'Photo', 'Classic'],
  item: {
    _id: imageID, 
    collectionName: collection,
    likes: likes,
    previewImageUrl: "https://gateway.pinata.cloud/ipfs/Qme37jp8q5u12GAs43n3NAKvGoJKoeiQjYVk3MHqiawcCa",
    title: 'Amazing Galaxy',
    tags: ['Galaxy', 'Art', 'Creation'],
  },
  minimumBid: {
    amount: 600,
    createdAt: new Date(),
    tokenSymbol: 'ALGOP',
  },
  lowestBid: {
    amount: 100,
    createdAt: new Date(),
    tokenSymbol: 'USD',
    bidder: {
      account: account,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      createdAt: new Date(),
      name: 'Gleisson',
      role: 'creator',
      updatedAt: new Date(),
      type: 'developer',
      bio: 'Director of Criptonomia'
    }
  },
  highestBid: {
    amount: 900,
    createdAt: new Date(),
    tokenSymbol: 'ETH',
    bidder: {
      account: account,
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      createdAt: new Date(),
      name: 'Lincoln',
      role: 'owner',
      updatedAt: new Date(),
      type: 'developer',
      bio: 'Product Manager of Criptonomia'
    }
  },
  bids: [
    {
      amount: 100,
      createdAt: new Date(),
      tokenSymbol: 'USD',
      bidder: {
        account: account,
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        createdAt: new Date(),
        name: 'Gleisson',
        role: 'creator',
        updatedAt: new Date(),
        type: 'developer',
        bio: 'Director of Criptonomia'
      }
    },
    {
      amount: 900,
      createdAt: new Date(),
      tokenSymbol: 'ETH',
      bidder: {
        account: account2,
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        createdAt: new Date(),
        name: 'Lincoln',
        role: 'owner',
        updatedAt: new Date(),
        type: 'developer',
        bio: 'Product Manager of Criptonomia'
      }
    }
  ],
  owner: account,
  users: [
    {
      account: account,
      createdAt: new Date(),
      type: 'user',
      role: 'owner',
      name: 'Image Owner',
      updatedAt: new Date(),
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      account: account2,
      createdAt: new Date(),
      type: 'algop',
      role: 'creator',
      name: 'Image Creator',
      updatedAt: new Date(),
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
  ]
}};

const collectionData = (prefix:string, images: ICollectionImage[], account: string) : ICollection => { return {
  title: prefix,
  description: 'A ' + prefix + ' collection',
  owner: account,
  images: images
}};

const imagesData = (collection: string, account: string, account2: string) : IImage => { return {
  owner: account,
  users: [
    {
      account: account,
      createdAt: new Date(),
      type: 'user',
      role: 'owner',
      name: 'Image Owner',
      updatedAt: new Date(),
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      account: account2,
      createdAt: new Date(),
      type: 'algop',
      role: 'creator',
      name: 'Image Creator',
      updatedAt: new Date(),
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
  ],
  description: 'Image Description ' + Math.floor(Math.random() * 101),
  likes: Math.floor(Math.random() * 1001),
  title: 'Image ' + Math.floor(Math.random() * 101),
  collectionName: collection,
  tags: [ 'Nice', 'Awesome' ],
  nft: {
    _id: "60cbcbeceddab1956ce0685f",
    artist: {
      name:"Hashly Gwei",
      address:"0x7dDFb53887D2EB323CE0409E792759F916B0e229",
      website:"https://www.algopainter.art",
      twitter:"https://www.twitter.com/algopainter",
      github:"https://github.com/algopainter/ms-algopainter-gwei",
      instagram:"https://www.instagram.com/algopainter",
      account: "0x7dDFb53887D2EB323CE0409E792759F916B0e229",
      createdAt: new Date(),
      role: 'creator',
      type: 'developer',
      _id: '',
      updatedAt: new Date(),
    },
    image:"https://gateway.pinata.cloud/ipfs/QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
    previewImage:"https://gateway.pinata.cloud/ipfs/QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
    rawImage:"https://gateway.pinata.cloud/ipfs/Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
    parameters:{
      text:"Bull market",
      inspiration:"3",
      useRandom:"true",
      probability:0.5,
      place:"4",
      description:"Recovered",
      amount:300
    }
  }
}};

const usersData = () : IUser => { return {
  account: "0x4E9F8B25Ea6007ef3E7e1d195d4216C6dC04a5d2",
  createdAt: new Date(),
  name: 'Gleisson de Assis',
  role: 'owner',
  type: 'developer',
  updatedAt: new Date(),
  avatar: 'https://avatars.githubusercontent.com/u/5391579?v=4',
  bio: 'Director of Criptonomia'
}};

const bidsData = (account: string, imageId: string) : IBid => { return {
  amount: Math.floor(Math.random() * 10001),
  bidBack: Math.floor(Math.random() * 11),
  bidder: account,
  createdAt: new Date(),
  item: {
    _id: imageId,
    title: 'Bid item',
    previewImageUrl: 'https://gateway.pinata.cloud/ipfs/QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP'
  },
  tokenSymbol: 'ETH'
} };

export {
  auctionData, 
  collectionData, 
  usersData,
  imagesData,
  bidsData
}