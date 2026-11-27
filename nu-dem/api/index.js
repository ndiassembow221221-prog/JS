import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), 'db.json'));

server.use(jsonServer.defaults());
server.use(jsonServer.rewriter({ '/api/*': '/$1' }));
server.use(router);

export default server;
