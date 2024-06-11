import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
};

export default corsOptions;