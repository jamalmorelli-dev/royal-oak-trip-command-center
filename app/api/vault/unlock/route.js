import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
function token(pin,secret){return createHmac('sha256',secret).update(`royal-oak-travel-vault:v1:${pin}`).digest('hex')}
function eq(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y)}
export async function POST(request){const pin=process.env.TRAVEL_VAULT_PIN,secret=process.env.TRAVEL_VAULT_SECRET;if(!pin||!secret)return NextResponse.json({ok:false,error:'Private Travel Vault is not configured.'},{status:503});let body={};try{body=await request.json()}catch{}if(!eq(body.pin||'',pin))return NextResponse.json({ok:false,error:'Incorrect vault PIN.'},{status:401});const res=NextResponse.json({ok:true});res.cookies.set('travel_vault',token(pin,secret),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});return res}
