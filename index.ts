
import 'dotenv/config'
import app from './app';
import { checkTableExistOrNot } from './common/common';

const port = process.env.PORT || 3001;

app.listen(port, async () => {
  await checkTableExistOrNot()
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});