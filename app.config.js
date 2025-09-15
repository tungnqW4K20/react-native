import 'dotenv/config'; // nếu muốn dùng file .env

export default () => ({
  expo: {
    name: "my-app",
    slug: "my-app",
    extra: {
      API_URL: process.env.API_URL || "https://example.com/api",
      GOOGLE_KEY: process.env.GOOGLE_KEY || "abc123"
    }
  }
});