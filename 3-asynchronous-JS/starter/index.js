const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      else resolve('Success');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);

    const writes = all.map(({ body: { message } }, i) =>
      writeFilePro(`dog-img${i}.txt`, message)
    );

    await Promise.all(writes);

    console.log('Wrote random dog images to file!');
  } catch (err) {
    throw err;
  }

  return '2: READY :😃 ';
};

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const dogPic = await getDogPic();
    console.log(dogPic);
    console.log('3: Got dog pics!');
  } catch (err) {
    console.error(err);
  }
})();

/*
console.log('1: Will get dog pics!');
getDogPic()
  .then((res) => {
    console.log(res);
    console.log('3: Done getting dog pics!');
  })
  .catch((err) => console.error(err));

/*

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(({ body: { message } }) => {
    return writeFilePro('dog-img.txt', message);
  })
  .then((res) => {
    console.log('Wrote random dog image to file!');
  })
  .catch((err) => console.error(err));

  */
