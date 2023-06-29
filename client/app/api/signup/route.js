import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log(data);
  if (res.ok) {
    return NextResponse.json(data, { status: 201 });
  } else {
    return NextResponse.json(data, { status: 400 });
  }
}
