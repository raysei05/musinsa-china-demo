import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import handler from './api/analyze.js';
const root=resolve('public');
const server=http.createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/api/analyze'){
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>3_200_000){res.writeHead(413);res.end('{"error":"Image too large"}');return;}}
   req.body=body;res.status=code=>(res.statusCode=code,res);res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));};return await handler(req,res);
  }
  const file=resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path));
  if(!file.startsWith(root+sep)){res.writeHead(403);return res.end();}
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg'};
  const data=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Local app: http://127.0.0.1:'+server.address().port));
