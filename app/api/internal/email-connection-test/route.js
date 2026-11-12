import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") return NextResponse.json({ error: "Not found" }, { status: 404 });
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {"api-key":process.env.BREVO_API_KEY || "",accept:"application/json","Content-Type":"application/json"},
    body:JSON.stringify({
      sender:{ email:process.env.BREVO_SENDER_EMAIL, name:"What's My AIQ" },
      to:[{email:"integration-check@example.invalid"}],
      subject:"Sandbox email authentication test",
      htmlContent:"<p>This message is not delivered.</p>",
      headers:{"X-Sib-Sandbox":"drop"}
    })
  });
  const json=await response.json().catch(()=>({}));
  const body=String(json.message||"").toLowerCase();
  let reason="unknown";
  if (body.includes("ip address")||body.includes("ip restriction")) reason="ip_restriction";
  else if(body.includes("access denied")||body.includes("permission")) reason="permission";
  else if(body.includes("key")) reason="key_rejected";
  else if(body.includes("sender")) reason="sender_rejected";
  const ok=response.ok&&Boolean(json.messageId);
  console.info("AIQ sandbox email auth", {ok,status:response.status,code:json.code||null,reason});
  return NextResponse.json({ok,status:response.status,code:json.code||null,reason,deliveryAttempted:false},{status:ok?200:502,headers:{"Cache-Control":"no-store"}});
}
