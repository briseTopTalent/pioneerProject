import React, { forwardRef, useState, useEffect, useRef } from "react";
import config from "config";
//import addressParser from "../../../server/src/utils/addressParser";
import { debounce, dynamicGoogleMapsLoader, dynamicLoader, getGoogleMapsSDK } from "utils";

const d = console.debug;
const makeMarker = ({
	search,
	latitude,
	longitude,
	zoom,
	width = 80,
	height = 80,
	className = "map-pin",
}) => {
	const maps = getGoogleMapsSDK("maps");
	const { Map } = maps;
	const { AdvancedMarkerElement } = getGoogleMapsSDK("marker");
	const map = new Map(document.getElementById("map"), {
		center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
		zoom,
		mapId: String(search).replace(/[^a-z0-9]+/, "_"),
	});
	const img = document.createElement("div");
	img.className = className;
	img.width = width;
	img.height = height;

	const advMarker = new AdvancedMarkerElement({
		map,
		position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
		content: img,
		title: search,
	});
};

export const GoogleMap = forwardRef(
	(
		{
			showNow = false,
			value = null,
			formClassName,
			id,
			label,
			placeholder,
			onHandleChange,
			performSearch = null,
			...props
		},
		ref
	) => {
		const zoomedOut = 20;
		const zoomedIn = 8;
		const type = "text";
		const [changed, setChanged] = useState(Date.now());
		const [latitude, setLatitude] = useState(0.0);
		const [longitude, setLongitude] = useState(0.0);
		const [zoom, setZoom] = useState(zoomedOut);
		const [show, setShow] = useState(false);
		const [selected, setSelected] = useState({});
		const [options, setOptions] = useState([]);
		const [handleChange, setHandleChange] = useState({});
		const [GoogleMap, setMap] = useState(null);
		const [selectedOption, setSelectedOption] = useState(0);
		const [initialValue,setInitialValue] = useState(value);
		let Places = null;
		const selectVal = (v) => {
			document.getElementById(id).value = v.label;
			GSearch(v.label, { forceShow: false });
			setShow(false);
		};
		if(typeof performSearch === 'function'){
			performSearch(selectVal);
		}
		const GSearch = (search = null, opts = {}) => {
			const input = document.getElementById(id);
			if (input === null) {
				return;
			}
			if (search === null) {
				search = input.value;
			}
			if(search.length === 0){
				return;
			}
			let latitude = 0,
				longitude = 0;
			let G = window.firewire_google_sdk;
			let P = window.firewire_google_sdk.places;
			const places = P;
			const displaySuggestions = function (predictions, status) {
				if (status != places.PlacesServiceStatus.OK || !predictions) {
					if (status === "ZERO_RESULTS") {
						return;
					}
					alert(status);
					return;
				}
				let opt = [];
				predictions.forEach((p) => {
					opt.push({ label: p.description, value: p.place_id });
				});
				setOptions(opt);
				if (typeof opts.forceShow === "boolean") {
					setShow(opts.forceShow);
				} else {
					setShow(true);
				}
				setZoom(zoomedOut);
			};
			const service = new places.AutocompleteService(input, {
				fields: ["place_id", "geometry", "name", "formatted_address"],
			});
			console.debug({ service });

			service.getQueryPredictions({ input: search }, displaySuggestions);
			const maps = G.maps;
			const geocoder = new maps.Geocoder();
			geocoder.geocode({ address: search }, function (results, status) {
				if (status == maps.GeocoderStatus.OK) {
					latitude = results[0].geometry.location.lat();
					longitude = results[0].geometry.location.lng();
					setSelected({
						latitude,
						longitude,
					});
					setZoom(zoomedIn);
					makeMarker({
						search,
						latitude,
						longitude,
						zoom,
					});
					setHandleChange({ address: search, latitude, longitude });
					if (typeof opts.forceShow === "boolean") {
						setShow(opts.forceShow);
					} else {
						setShow(true);
					}
					return onHandleChange({ address: search, latitude, longitude });
					return;
				} else {
					setZoom(zoomedOut);
					setSelected(null);
					console.error("Geocode was not successful for the following reason: " + status);
				}
			});

			setZoom(zoomedOut);
			if (handleChange) {
				setZoom(zoomedIn);
			}
			return onHandleChange({ address: search, latitude, longitude });
		};
		const doSearch = debounce(() => GSearch(), 2000);
		const triggerSearch = (e) => {
			setHandleChange(null);
			doSearch();
			if (handleChange) {
				return onHandleChange(handleChange);
			}
		};
    const arrowModeActivated = _ => document.querySelectorAll('div[class*="ggle-map-selected"]').length;
			function process() {
				console.debug("useEffect for highlighter arrow down/up");
				const input = document.getElementById(id);
				input.addEventListener("keydown", (ev) => {
					const sel = document.querySelectorAll('div[class*="ggle-map-option"]');
					let entries = [];
					for (let i = 0; i < sel.length; i++) {
						entries.push(document.getElementById(`ggle-map-${i}`));
					}
					if (localStorage.getItem("ggle-map-selected") === null) {
						localStorage.setItem("ggle-map-selected", 0);
					}
					let index = parseInt(localStorage.getItem("ggle-map-selected"));
					if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
						const dir = ev.key === "ArrowDown" ? "+" : "-";
						for (const opt of sel) {
							opt.classList.remove("ggle-map-selected");
						}
						console.debug({ entries }, { index });
						if (typeof entries[index] === "undefined") {
							index = 0;
						}
						if (dir == "+") {
							++index;
							if (index >= entries.length) {
								index = 0;
							}
						} else {
							--index;
							if (index < 0) {
								index = entries.length - 1;
							}
						}
						entries[index].classList.add("ggle-map-selected");
						localStorage.setItem("ggle-map-selected", index);
						return;
					}
					if (["Enter","Tab"].includes(ev.key) && arrowModeActivated()) {
						if (typeof entries[index] !== "undefined") {
							document.getElementById(id).value = entries[index].innerText;
							localStorage.setItem("ggle-map-selected", 0);
							selectVal({ label: entries[index].innerText });
							return;
						}
					}
					console.debug(ev);
				});
				if (showNow && initialValue && initialValue.length) {
					selectVal({ label: initialValue,});
				}
			}
		useEffect(() => {
			dynamicGoogleMapsLoader().then((sdk) => {
				console.debug('THEN',sdk);
				let G = sdk;
				let P = sdk.places;
				setInitialValue(value);
				process();
			});
		}, []);

		return (
			<div className={"form-group " + formClassName}>
				<label htmlFor={label}>{label}</label>
				<input
					id={id}
					ref={ref}
					type={type}
					className="form-control"
					placeholder="Enter an address"
					onChange={(e) => triggerSearch()}
					autoComplete="off"
				/>
				<div
					style={{ width: "93%", marginLeft: "1em", top: "80px" }}
					role="menu"
					className={`dropdown-menu ${show ? "show" : ""}`}
					data-dropdown-in="flipInX"
					data-dropdown-out="flipOutX"
				>
					{options &&
						options.map((o, i) => (
							<div
								className="dropdown-item ggle-map-option"
								key={i}
								value={o.value}
                onClick={(e) => {
                  d(`onClick:`,{e,o});
                  selectVal(o);
                }}
								id={`ggle-map-${i}`}
							>
								{" "}
								{o.label}
							</div>
						))}
				</div>
				<div
					style={{
						height: "400px",
						width: "100%",
						marginTop: "10px",
						marginBottom: "20px",
					}}
				>
					<div
						id="map"
						style={{
							height: "400px",
							width: "400px",
							marginTop: "10px",
							marginBottom: "20px",
						}}
					></div>
				</div>
			</div>
		);
	}
);
