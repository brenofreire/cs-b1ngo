function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delayedLoop(fn, list) {
  for (let item of list) {
    fn(item);
    await delay(5_000);
  }
}

module.exports = {
  delayedLoop,
};
