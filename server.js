console.log(`Current working directory: ${process.cwd()}`);

const app = require('./src/app');
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});