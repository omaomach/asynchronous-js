const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('FILE NOT FOUND!!');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('COULD NOT WRITE FILE');
      resolve('SUCCESS!');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const resolved1Promise = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const resolved2Promise = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const resolved3Promise = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([
      resolved1Promise,
      resolved2Promise,
      resolved3Promise,
    ]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    const writeResult = await writeFilePromise('dog-img.txt', imgs.join('\n'));
    console.log(writeResult);

    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err; // THIS WILL MARK THE ENTIRE PROMISE AS REJECTED
  }
  return '2. READY'; // THE RETURNED VALUE FROM AN ASYNC FUNCTION IS THE RESOLVED VALUE OF THE PROMISE
};

(async () => {
  try {
    console.log('1. Will get dog pics!');
    const dogPic = await getDogPic(); // WE ARE HANDLING THE RETURNED VALUE AS ANOTHER PROMISE
    console.log(dogPic);
    console.log('3. Done getting dog pics!');
  } catch (err) {
    console.log('ERROR!!!');
  }
})();

/*
console.log('1. Will get dog pics!');
getDogPic()
  .then((dogPic) => {
    console.log(dogPic);
    console.log('3. Done getting dog pics!');
  })
  .catch((err) => {
    console.log('ERROR!!!');
  });

*/

// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePromise('dog-img.txt', res.body.message);
//   })
//   .then((result) => {
//     console.log(result);
//     console.log('Random dog image saved to file');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
