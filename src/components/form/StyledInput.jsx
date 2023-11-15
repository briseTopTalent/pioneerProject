import React, { forwardRef, useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import config from "config";
import addressParser from "../../../server/src/utils/addressParser";
import { dynamicGoogleMapsLoader, dynamicLoader, getGoogleMapsSDK,} from "utils";

const Marker = () => <div className="map-pin"></div>;

const StyledInput = forwardRef(
	({ label, formClassName, type, placeholder, error, touched, ...props }, ref) => {
		return (
			<>
				{type != "checkbox" ? (
					<div className={"form-group " + formClassName}>
						<label htmlFor={label}>{label}</label>
						<input
							ref={ref}
							type={type}
							className="form-control"
							placeholder={placeholder}
							{...props}
						/>
						{touched && error && <p className="font-14 mt-15 text-danger">* {error}</p>}
					</div>
				) : (
					<div className="custom-control custom-checkbox mb-25">
						<input
							ref={ref}
							className="custom-control-input"
							id={label}
							type="checkbox"
							{...props}
						/>
						<label className="custom-control-label font-14" htmlFor={label}>
							{label}
						</label>
					</div>
				)}
			</>
		);
	}
);

export const StyledSelect = forwardRef(
	({ label, formClassName, type, placeholder, error, touched, options, ...props }, ref) => {
		return (
			<div className={"form-group " + formClassName}>
				{label && <label htmlFor={label}>{label}</label>}
				<select ref={ref} className="form-control" {...props} defaultValue={""}>
					<option disabled value={""} selected>
						{" "}
						{placeholder}{" "}
					</option>
					{options &&
						options.map((o, i) => (
							<option key={i} value={o.value}>
								{o.label}
							</option>
						))}
				</select>
				{touched && error && <p className="font-14 mt-15 text-danger">* {error}</p>}
			</div>
		);
	}
);

export const StyledAddressInput = forwardRef(
	(
		{
			showNow = false,
			label,
			formClassName,
			type,
			placeholder,
			onHandleChange,
			error,
			touched,
			...props
		},
		ref
	) => {
		const [options, setOptions] = useState([]);
		const [show, setShow] = useState(false);
		const [selected, setSelected] = useState(null);
		const ref2 = useRef(null);
		const zoomedIn = 15;
		const zoomedOut = 8;
		const f = { ...props };
		const allValues = f?.allValues;
		const latitude = allValues ? allValues.latitude : null;
		const longitude = allValues ? allValues.longitude : null;
		const [zoom, setZoom] = useState(f.value ? zoomedIn : zoomedOut);

		const GSearch = (search) => {
			let latitude = 0,
				longitude = 0;
			let G = window.firewire_google_sdk.google;
			let P = window.firewire_google_sdk.places;
			const displaySuggestions = function (predictions, status) {
				if (status != P.PlacesServiceStatus.OK || !predictions) {
					alert(status);
					return;
				}
				console.log("predictions--->", predictions);
				let opt = [];
				predictions.forEach((p) => {
					console.log(p);
					opt.push({ label: p.description, value: p.place_id });
				});
				setOptions(opt);
				setShow(true);
				setZoom(zoomedOut);
			};

			const input = document.getElementById("address");
			const service = new P.AutocompleteService(input, {
				fields: ["place_id", "geometry", "name", "formatted_address"],
			});

			service.getQueryPredictions({ input: search }, displaySuggestions);
			const geocoder = new G.maps.Geocoder();
			geocoder.geocode({ address: search }, function (results, status) {
				if (status == G.maps.GeocoderStatus.OK) {
					latitude = results[0].geometry.location.lat();
					longitude = results[0].geometry.location.lng();
					setSelected({
						latitude,
						longitude,
					});
					setZoom(zoomedIn);
					return onHandleChange({ address: search, latitude, longitude });
				} else {
					setZoom(zoomedOut);
					console.error("Geocode was not successful for the following reason: " + status);
				}
			});

			setZoom(zoomedIn);
			return onHandleChange({ address: search, latitude, longitude });
		};

		const seletVal = (v) => {
			GSearch(v.label);
			setShow(false);
		};

		useEffect(() => {
			function handleClickOutside(event) {
				if (ref2?.current && !ref2?.current.contains(event.target)) {
					setShow(false);
				}
			}
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref2]);

		useEffect(() => {
			dynamicGoogleMapsLoader().then((sdk) => {
				console.debug('THEN',sdk);
				let G = sdk;
				let P = sdk.places;
				if (showNow) {
					console.debug("G", G);
					console.debug("P", P);
					const input = document.getElementById("address");
					const service = new P.AutocompleteService(input, {
						fields: ["place_id", "geometry", "name", "formatted_address"],
					});
					const geocoder = new G.maps.Geocoder();
					geocoder.geocode({ address: input.value }, function (results, status) {
						if (status == G.maps.GeocoderStatus.OK) {
							const tmp_latitude = results[0].geometry.location.lat();
							const tmp_longitude = results[0].geometry.location.lng();
							setSelected({
								latitude: tmp_latitude,
								longitude: tmp_longitude,
							});
							setZoom(zoomedIn);
						} else {
							setZoom(zoomedOut);
							console.error(
								"Geocode was not successful for the following reason: " + status
							);
						}
					});
				}
			});
		}, []);

		return (
			<div ref={ref2} className={"form-group " + formClassName}>
				<label htmlFor={label}>{label}</label>
				<input
					ref={ref}
					type={type}
					className="form-control"
					placeholder={placeholder}
					onChange={(e) => GSearch(e.target.value)}
					{...props}
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
								className="dropdown-item"
								key={i}
								value={o.value}
								onClick={() => seletVal(o)}
							>
								{" "}
								{o.label}
							</div>
						))}
				</div>
				{touched && error && <p className="font-14 mt-15 text-danger">* {error}</p>}
				<div
					style={{
						height: "400px",
						width: "100%",
						marginTop: "10px",
						marginBottom: "20px",
					}}
				>
					<GoogleMapReact
						bootstrapURLKeys={{ key: config.MAP_API }}
						center={{
							lat: selected ? selected.latitude : latitude,
							lng: selected ? selected.longitude : longitude,
						}}
						zoom={zoom}
					>
						{selected && <Marker lat={selected.latitude} lng={selected.longitude} />}
						{latitude && longitude && <Marker lat={latitude} lng={longitude} />}
					</GoogleMapReact>
				</div>
			</div>
		);
	}
);

export default StyledInput;
