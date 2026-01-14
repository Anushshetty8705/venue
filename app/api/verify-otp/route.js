export async function POST(req) {
  try {
    const { email, otp } = await req.json();
  

    if (
      global.otpStore &&
      global.otpStore.email === email &&
      global.otpStore.otp === otp &&
      global.otpStore.expires > Date.now()
    ) {
      return new Response(JSON.stringify({ success: true, message: "OTP verified ✅" }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false, message: "Invalid or expired OTP ❌" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
