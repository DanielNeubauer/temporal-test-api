import fetch from "node-fetch";

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function fetchImage(imageUrl: string): Promise<string>{
  const response = await fetch(imageUrl)
  const buf = await response.buffer()
  return buf.toString('base64');
}
export async function storeImage(image: string, name:string): Promise<string>{
  const body =
  {"type":"insert","args":{"table":{"name":"test_image","schema":"public"},"objects":[{"image":image, "name": name}, ],"returning":[]}}
  const response = await fetch('http://mydb', 
  {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  })
  if(response.ok){
    return 'saved'
  }
  throw new Error('call failed')
}