const p = () => new Promise((resolve) => {
    console.log('hello!');
    resolve(true);
});

console.log(false || await p());
console.log(true || await p());
