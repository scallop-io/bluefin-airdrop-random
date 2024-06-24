import { getDrandRound, getFutureDrandRound } from './drand';
import blake2b from 'blake2b';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { generateAddresses } from './utils/addressGenerator';
dotenv.config();

const isTest = false;
const folderName = isTest ? 'test_result' : 'result';
const PICKED_ROUND = 4126285;


async function main() {
  if(!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
  let addresses: string[] = [];
  if(isTest) {
    addresses = generateAddresses(2000);
  } else {
    addresses = JSON.parse(fs.readFileSync('eligible-user.json', 'utf-8')) as string[];
  }
  await generateHashResults(addresses, PICKED_ROUND);
  sortHashResult();
}


async function generateHashResults(addresses: string[], selectedRound: number) {
  const drand = await getDrandRound(selectedRound);

  const hashedResults: {address: string, randomness: string, hashResultHex: string, hashResultNumber: string}[] = []; 
  addresses.forEach((address) => {
    const input = Buffer.from(`${address}${drand.randomness}`);
    const output = new Uint8Array(32);
    // Use personalization message to make the hash unique each application
    const hash = blake2b(output.length, undefined, undefined, Buffer.from("scallop-bluefin1")).update(input).digest('hex');
    hashedResults.push({
      address,
      randomness: drand.randomness,
      hashResultHex: hash,
      hashResultNumber: BigInt('0x' + hash).toString(),
    });
    
  });
  fs.writeFileSync(`${folderName}/hashedResults.json`, JSON.stringify(hashedResults, null, 2));
}

function sortHashResult() {
  const hashedResults = JSON.parse(fs.readFileSync(`${folderName}/hashedResults.json`, 'utf-8'));
  const sortedResults = hashedResults.sort((a: any, b: any) => {
    const aHashResultNumber = BigInt(a.hashResultNumber);
    const bHashResultNumber = BigInt(b.hashResultNumber);
    if (aHashResultNumber > bHashResultNumber) {
      return -1;
    }
    if (aHashResultNumber < bHashResultNumber) {
      return 1;
    }
    return 0;
  }).map((result: any, index: number) => {
    return {...result, rank: index + 1}
  });
  fs.writeFileSync(`${folderName}/sortedResults.json`, JSON.stringify(sortedResults, null, 2));
}


main();
