/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const db = require('../context/db');

const MAX_ATTEMPTS = 20;
const DELAY = 5000;

async function wait(ms = DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDb() {
  // for (let i = 0; i <= MAX_ATTEMPTS; i += 1) {
  //   if (i === MAX_ATTEMPTS) {
  //     console.error(`Max attempts exceeded ${MAX_ATTEMPTS}`);
  //     throw new Error(`Max attempts exceeded ${MAX_ATTEMPTS}`);
  //   }
  //   console.log(`connection attempt ${i + 1}`);
  //   try {
  //     const result = await db.raw('select 1+1 as up');
  //     if (result && result.rows && result.rows[0].up === 2) {
  //       console.log('connection established');
  //       break;
  //     }
  //   } catch (e) {
  //     console.log(e.message);
  //     await wait();
  //   }
  // }
  await wait(10000);
}

waitForDb();
