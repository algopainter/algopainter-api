import { IAuction } from "./domain/auction";
import { ICollection } from "./domain/Collection";
import { IImage } from "./domain/image";
import { IUser } from "./domain/user";

const auctionData = (imageID: string) : IAuction => { return {
  isHot: false,
  fee: {
    bidBack: 10,
    royalities: [
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
    likes: Math.floor(Math.random() * 101),
    previewImageUrl: "https://gateway.pinata.cloud/ipfs/Qme37jp8q5u12GAs43n3NAKvGoJKoeiQjYVk3MHqiawcCa",
    title: 'Amazing Galaxy',
    tags: ['Galaxy', 'Art', 'Creation']
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
        _id: "60b6c7adf1cd1b3be43aa60e",
        networks: [
          {
            name: '@algopainter',
            type: 'instagram',
            url: 'https://instagram.com/algopainter'
          }
        ],
        type: 'developer',
        bio: 'Director of Criptonomia'
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
        _id: "60b6c7adf1cd1b3be43aa60e",
        networks: [
          {
            name: '@algopainter',
            type: 'instagram',
            url: 'https://instagram.com/algopainter'
          }
        ],
        type: 'developer',
        bio: 'Product Manager of Criptonomia'
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
      _id: "60b6c7adf1cd1b3be43aa60e",
      networks: [
        {
          name: '@algopainter',
          type: 'instagram',
          url: 'https://instagram.com/algopainter'
        }
      ],
      type: 'developer',
      bio: 'Director of Criptonomia'
    },
    {
      account: '0x0FR71571GTAHJU',
      avatar: 'https://randomuser.me/api/portraits/men/.jpg',
      createdAt: new Date(),
      name: 'Lincoln',
      role: 'owner',
      updatedAt: new Date(),
      _id: "60b6c7adf1cd1b3be43aa60e",
      networks: [
        {
          name: '@algopainter',
          type: 'instagram',
          url: 'https://instagram.com/algopainter'
        }
      ],
      type: 'developer',
      bio: 'Product Manager of Criptonomia'
    }
  ]
}};

const collectionData = (imageID: string) : ICollection => { return {
  title: 'Gwei ' + Math.floor(Math.random() * 101),
  description: 'A gwei collection ' + Math.floor(Math.random() * 101),
  owner: {
    account: '0x0FR71571GTAHJU',
    avatar: 'https://randomuser.me/api/portraits/men/.jpg',
    createdAt: new Date(),
    name: 'Lincoln',
    role: 'owner',
    updatedAt: new Date(),
    _id: "60b6c7adf1cd1b3be43aa60e",
    networks: [
      {
        name: '@algopainter',
        type: 'instagram',
        url: 'https://instagram.com/algopainter'
      }
    ],
    type: 'developer',
    bio: 'Product Manager of Criptonomia'
  },
  images: [
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    },
    {
      _id: imageID,
      users: [
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          createdAt: new Date(),
          name: 'Gleisson',
          role: 'creator',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Director of Criptonomia'
        },
        {
          account: '0x0FR71571GTAHJU',
          avatar: 'https://randomuser.me/api/portraits/men/.jpg',
          createdAt: new Date(),
          name: 'Lincoln',
          role: 'owner',
          updatedAt: new Date(),
          _id: "60b6c7adf1cd1b3be43aa60e",
          networks: [
            {
              name: '@algopainter',
              type: 'instagram',
              url: 'https://instagram.com/algopainter'
            }
          ],
          type: 'developer',
          bio: 'Product Manager of Criptonomia'
        }
      ],
      description: 'Image Description ' + Math.floor(Math.random() * 101),
      likes: Math.floor(Math.random() * 101),
      title: 'Ímage ' + Math.floor(Math.random() * 101),
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
          networks: [
            {
              name: "ms-algopainter-gwei",
              type: "github",
              url: "https://github.com/algopainter/ms-algopainter-gwei"
            }
          ]
        },
        image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
        previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
        rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
    }
  ]
}};

const imagesData = () : IImage => { return {
  users: [
    {
      account: '0x0FR71571GTAHJU',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      createdAt: new Date(),
      name: 'Gleisson',
      role: 'creator',
      updatedAt: new Date(),
      _id: "60b6c7adf1cd1b3be43aa60e",
      networks: [
        {
          name: '@algopainter',
          type: 'instagram',
          url: 'https://instagram.com/algopainter'
        }
      ],
      type: 'developer',
      bio: 'Director of Criptonomia'
    },
    {
      account: '0x0FR71571GTAHJU',
      avatar: 'https://randomuser.me/api/portraits/men/.jpg',
      createdAt: new Date(),
      name: 'Lincoln',
      role: 'owner',
      updatedAt: new Date(),
      _id: "60b6c7adf1cd1b3be43aa60e",
      networks: [
        {
          name: '@algopainter',
          type: 'instagram',
          url: 'https://instagram.com/algopainter'
        }
      ],
      type: 'developer',
      bio: 'Product Manager of Criptonomia'
    }
  ],
  description: 'Image Description ' + Math.floor(Math.random() * 101),
  likes: Math.floor(Math.random() * 101),
  title: 'Ímage ' + Math.floor(Math.random() * 101),
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
      networks: [
        {
          name: "ms-algopainter-gwei",
          type: "github",
          url: "https://github.com/algopainter/ms-algopainter-gwei"
        }
      ]
    },
    image:"QmYbtF5aRXXLgs1HEgBWNxqJxzywLgHc8PtDdDGEsjK1zQ",
    previewImage:"QmTnJ8mpEeX3KX9BHc1B8sBdKWCDEKWk1fP9J5vUCZLrZP",
    rawImage:"Qmcz2eofzgahazVGuDwJXmpuFVdawVQKKuEV2a8vcYmZ33",
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
  account: "0x7dDFb53887D2EB323CE0409E792759F916B0e229",
  createdAt: new Date(),
  name: 'Gleisson de Assis',
  networks: [
    {
      name: "gleisson.assis",
      type: 'instagram',
      url: 'https://instagram.com/gleisson.assis'
    }
  ],
  role: 'owner',
  type: 'developer',
  updatedAt: new Date(),
  avatar: 'https://avatars.githubusercontent.com/u/5391579?v=4',
  bio: 'Director of Criptonomia'
}};

export {
  auctionData, 
  collectionData, 
  usersData,
  imagesData
}