const Koa = require('koa');
const models = require('./models');
const config = require('config');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

app.use(async ctx => {
  // There are no migrations setup in this sample project so the find operation may fail due to non-existing table.
  try {
    const kings = await models.King.findAll();
    var result = 'Kings: ' + kings.map(k => k.name).join(', ');
  }
  catch (err) {
    var result = 'There are no kings :(';
  }

  ctx.body = `
    <html>
    <head>
      <title>End-to-end testing demo</title>
    </head>
    <body>
      <div>This is sparta!</div>
      <div>${result}</div>
    </body>
    </html>
  `
});

app.listen(parseInt(config.app.port), () => {
  console.log(`Server is listening on port ${config.app.port}`);
});
