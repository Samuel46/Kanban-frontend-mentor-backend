import { CorsOptions } from "cors";
import { allowedOrigins } from "./allowedOrigin";

export const corsOptions: CorsOptions = {
	origin: (origin: string | undefined, callback: Function) => {
		if ((origin && allowedOrigins.indexOf(origin) !== -1) || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},

	optionsSuccessStatus: 200,
};
