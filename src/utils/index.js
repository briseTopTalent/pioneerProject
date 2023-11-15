import config from "config";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
export const formatErrorResponse = (errorResponse) => ({
	error: errorResponse?.response?.data || errorResponse?.message || "An error occurred",
	isError: true,
});

export const formatSuccessResponse = (data) => ({
	data: data.data,
	isError: false,
});

export const constants = {
	DATE_FOMAT: "MMM DD hh:ss",
};

export const debounce = function debounce(func, timeout = 300) {
	// Source: https://www.freecodecamp.org/news/javascript-debounce-example/
	let timer;
	return function (...args) {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
export const dynamicLoader = async (func, timeout = 800) => {
	let interval = setInterval(async () => {
		if (!(await func())) {
			return;
		}
		clearInterval(interval);
	}, timeout);
};
export const dynamicGoogleMapsLoader = async () => {
	return new Promise((resolve, reject) => {
		let interval = setInterval(() => {
			if (typeof document === "undefined") {
				return;
			}
			clearInterval(interval);
			if (window.firewire_google_maps_loaded) {
				clearInterval(interval);
				return resolve(getGoogleMapsSDK());
			}

			((g) => {
				var h,
					a,
					k,
					p = "The Google Maps JavaScript API",
					c = "google",
					l = "importLibrary",
					q = "__ib__",
					m = document,
					b = window;
				b = b[c] || (b[c] = {});
				var d = b.maps || (b.maps = {}),
					r = new Set(),
					e = new URLSearchParams(),
					u = () =>
						h ||
						(h = new Promise(async (f, n) => {
							await (a = m.createElement("script"));
							e.set("libraries", [...r] + "");
							for (k in g)
								e.set(
									k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
									g[k]
								);
							e.set("callback", c + ".maps." + q);
							a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
							d[q] = f;
							a.onerror = () => (h = n(Error(p + " could not load.")));
							a.nonce = m.querySelector("script[nonce]")?.nonce || "";
							m.head.append(a);
						}));
				d[l]
					? console.warn(p + " only loads once. Ignoring:", g)
					: (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
			})({ key: config.MAP_API, v: "weekly", libraries: "places" });
			google.maps
				.importLibrary("places")
				.then((obj) => {
					(async () => {
						window.firewire_google_sdk_loaded = true;
						window.firewire_google_sdk = {
							maps: google.maps,
							sdk: google,
							marker: await google.maps.importLibrary("marker"),
							places: obj,
							loaded_at: Date.now(),
							loaded: true,
						};
						resolve(getGoogleMapsSDK());
						clearInterval(interval);
					})();
				})
				.catch((error) => {
					clearInterval(interval);
				});
		}, 800);
	});
};

export const getGoogleMapsSDK = (part = null) => {
	const C = window.firewire_google_sdk;
	if (part) {
		switch (part) {
			case "maps":
				return C.maps;
			case "places":
				return C.places;
			case "marker":
				return C.marker;
			default:
				return C;
		}
	}
	return C;
};
