import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||4173);
const key=process.env.INTERVALS_API_KEY;
const auth=key?'Basic '+Buffer.from('API_KEY:'+key).toString('base64'):null;
function send(res,status,data,type='application/json'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(type==='application/json'?JSON.stringify(data):data)}
async function upstream(p){const r=await fetch('https://intervals.icu/api/v1'+p,{headers:{Authorization:auth,Accept:'application/json'},signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('Intervals.icu HTTP '+r.status);return r.json()}
function series(streams,name){const s=streams.find(x=>x.type===name);return s?.data||[]}
function convert(streams){const time=series(streams,'time'),dist=series(streams,'distance'),speed=series(streams,'velocity_smooth');if(!time.length||(!speed.length&&!dist.length))throw Error('No hay streams de tiempo y velocidad/distancia disponibles');let rows=[];for(let i=0;i<time.length;i++){const t=Number(time[i]);let v=Number(speed[i]);if(!(v>0)&&i>0){let dt=t-Number(time[i-1]),dd=Number(dist[i])-Number(dist[i-1]);v=dt>0?dd/dt:0}if(Number.isFinite(t)&&v>0.5&&v<12)rows.push({t,p:1000/v})}if(rows.length<3)throw Error('No hay muestras de ritmo válidas');let origin=rows[0].t;return rows.map(x=>({t:x.t-origin,p:x.p}))}
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname.startsWith('/api/')){if(!auth)return send(res,503,{error:'Configura INTERVALS_API_KEY en el servidor local'});if(u.pathname==='/api/activities'){const oldest=u.searchParams.get('oldest'),newest=u.searchParams.get('newest');if(!/^\d{4}-\d{2}-\d{2}$/.test(oldest||'')||!/^\d{4}-\d{2}-\d{2}$/.test(newest||''))return send(res,400,{error:'Fechas inválidas'});const data=await upstream('/athlete/0/activities?oldest='+oldest+'&newest='+newest);return send(res,200,data.filter(x=>/run/i.test(x.type||'' )).map(x=>({id:x.id,name:x.name,date:x.start_date_local,distance:x.distance,moving_time:x.moving_time})))}
const m=u.pathname.match(/^\/api\/activities\/(i[\d]+)\/samples$/);if(m){const streams=await upstream('/activity/'+m[1]+'/streams.json?types=time,distance,velocity_smooth');return send(res,200,{samples:convert(streams)})}return send(res,404,{error:'Ruta no encontrada'})}
if(u.pathname!=='/'&&u.pathname!=='/index.html')return send(res,404,{error:'Not found'});return send(res,200,await readFile(path.join(root,'index.html'),'utf8'),'text/html; charset=utf-8')}catch(e){send(res,502,{error:String(e.message||e)})}}).listen(port,'127.0.0.1',()=>console.log('TempoLab: http://127.0.0.1:'+port));
