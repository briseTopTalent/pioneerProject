/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import "styles/css/style.css";
import "react-toastify/dist/ReactToastify.min.css";
import "styles/css/google-map.css";
import Providers from "components/layout/providers";
import { ToastContainer } from "react-toastify";
import "styles/dark.css";
import Script from "next/script";
import config from "config";

const YOUR_API_KEY = config.MAP_API;
const DOMAIN = config.DOMAIN;

export default function App({ Component, pageProps }) {
	console.debug({pageProps});
	return (
		<Providers>
			<Component {...pageProps} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Script
				src={`https://${DOMAIN}/maps/api/js?key=${YOUR_API_KEY}&libraries=places`}
			/>
		</Providers>
	);
}
