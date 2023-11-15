import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useFormik, yupToFormErrors } from "formik";
import { MapPin } from "react-feather";
import { object, number, string, array, boolean } from "yup";
import CreatableSelect from "react-select/creatable";

import withPrivateRoute from "components/wrapper/withPrivateRoute";
import DashboardLayout from "components/layout/dashboard/layout";
import StyledInput, { StyledAddressInput, StyledSelect } from "components/form/StyledInput";
import { useAuth } from "services/apiService";
import { useRouter } from "next/router";
import { Pages } from "utils/constants";

const CreateIncident = () => {
	const router = useRouter();
	const {
		createNewIncident,
		fetchAdminLocality,
		fetchLocalityDefinitions,
		fetchSublocality,
		fetchPrefilledFieldOptions,
		fetchPrefilledLocalityUnits,
		currentUser,
	} = useAuth();
	const [locality, setLocality] = useState([]);
	const [sublocality, setSublocality] = useState([]);
	const [prefilledFieldOptions, setPrefilledFieldOptions] = useState([]);
	const [prefilledUnits, setPrefilledUnits] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubLocalityLoading, setIsSubLocalityLoading] = useState(false);
	const [isPrefilledFieldOptionsLoading, setIsPrefilledFieldOptionsLoading] = useState(false);
	const [isPrefilledUnitsLoading, setIsPrefilledUnitsLoading] = useState(false);
	const [definitions, setDefinitions] = useState(null);
	const GSearch = (search) => {
		const displaySuggestions = function (predictions, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
				alert(status);
				return;
			}
			console.log(predictions);
			// predictions.forEach((prediction) => {
			// const li = document.createElement("li");

			// li.appendChild(document.createTextNode(prediction.description));
			// document.getElementById("results").appendChild(li);
			// });
		};

		const input = document.getElementById("address");
		console.log(input);
		const service = new google.maps.places.AutocompleteService(input, {
			fields: ["place_id", "geometry", "name", "formatted_address"],
		});

		service.getQueryPredictions({ input: search }, displaySuggestions);
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode({ address: search }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results);
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	};

	const fetchUserLocality = async () => {
		const { isError, data, error } = await fetchAdminLocality(currentUser.email);
		if (isError) toast.error(error.message);
		else {
			const l = data.data.map((t) => {
				return { label: t.name, value: t.id };
			});
			setLocality(l);
		}
	};
	const {
		values,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
		isSubmitting,
		setSubmitting,
		errors,
		touched,
	} = useFormik({
		initialValues: {
			locality: "",
			sub_locality: "0",
			address: "",
			longitude: "",
			latitude: "",
			field1_value: "",
			field2_value: "",
			field3_value: "",
			field4_value: "",
			field5_value: "",
			responding_units: [],
			featured: false,
		},
		validationSchema: object().shape({
			locality: string().required("Locality is required"),
			address: string().required("Address is required"),
			sub_locality: string().when("locality", {
				is: (locality) => {
					console.log(locality);
					return sublocality.length > 0;
				},
				then: string().required("Sub Locality is Required"),
			}),
			longitude: number().required("Longitude is required"),
			latitude: number().required("Latitude is required"),
			field1_value: string().optional(),
			field2_value: string().optional(),
			field3_value: string().optional(),
			field4_value: string().optional(),
			field5_value: string().optional(),
			responding_units: array().of(string()),
			featured: boolean().default(false),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			// console.log(formData, errors);
			const { isError, data, error } = await createNewIncident(formData);
			console.log(isError, data, error);
			if (isError) {
				toast.error(error.message);
			} else {
				toast.success("success");
				return router.push(`/${Pages.INCIDENT}`);
			}
			setSubmitting(false);
		},
	});

	const FetchDefintions = async (id) => {
		const { isError, data, error } = await fetchLocalityDefinitions(id);
		if (isError) toast.error(error.data.message);
		else setDefinitions(data);
		setIsLoading(false);
	};

	const FetchSubLocalities = async (id) => {
		setIsSubLocalityLoading(true);
		const { isError, data, error } = await fetchSublocality(id, 1, 100);
		if (isError) toast.error(error.data.message);
		else {
			const l = data.data.map((t) => {
				return { label: t.name, value: t.id };
			});
			setSublocality(l);
			console.log(l);
		}
		setIsSubLocalityLoading(false);
	};

	const FetchPrefilledFieldOptions = async (id) => {
		setIsPrefilledFieldOptionsLoading(true);
		const { isError, data, error } = await fetchPrefilledFieldOptions(id, 1, 100);
		if (isError) toast.error(error.data.message);
		else {
			const l = data.data.map((t) => {
				return { label: t.option_name, value: t.option_name, field_number: t.field_number };
			});
			setPrefilledFieldOptions(l);
		}
		setIsPrefilledFieldOptionsLoading(false);
	};

	const FetchPrefilledLocalityUnits = async (id) => {
		setIsPrefilledUnitsLoading(true);
		const { isError, data, error } = await fetchPrefilledLocalityUnits(id, 1, 700);
		if (isError) toast.error(error.data.message);
		else {
			console.log(data);
			const l = data.data.map((t) => {
				return { label: t.unit_name, value: t.unit_name };
			});
			setPrefilledUnits(l);
		}
		setIsPrefilledUnitsLoading(false);
	};

	const handleC = (newValue, actionMeta) => {
		let v = [];
		newValue.map((r) => {
			v.push(r.value);
		});
		setFieldValue("responding_units", v);
	};

	const handleFieldChange = (type, newValue) => {
		setFieldValue(type, newValue);
	};

	const setSubValue = (v) => setFieldValue("featured", v);

	useEffect(async () => {
		await fetchUserLocality();
	}, []);
	console.log("errors-->", errors);
	const fetchRData = () => {
		const g = values.responding_units;
		let f = g.map((r) => {
			return { label: r, value: r };
		});
		return f;
	};

	const prefilledFieldOptions1 = prefilledFieldOptions.filter((f) => f.field_number === 1);
	const prefilledFieldOptions2 = prefilledFieldOptions.filter((f) => f.field_number === 2);
	const prefilledFieldOptions3 = prefilledFieldOptions.filter((f) => f.field_number === 3);
	const prefilledFieldOptions4 = prefilledFieldOptions.filter((f) => f.field_number === 4);
	const prefilledFieldOptions5 = prefilledFieldOptions.filter((f) => f.field_number === 5);

	return (
		<DashboardLayout pageTitle={"Create Incident"}>
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<MapPin />
					</span>
					Create Incident
				</h4>
				<div className="d-flex">
					<Link href={`/${Pages.LOCALITY}`}>
						<button className="btn btn-primary btn-sm">Cancel</button>
					</Link>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<section className="hk-sec-wrapper">
						<div className="row">
							<div className="col-sm">
								<form onSubmit={handleSubmit}>
									<div className="row">
										<StyledSelect
											id="Locality"
											label="Locality"
											type="text"
											formClassName="col-md-6"
											name="locality"
											value={values.locality}
											options={locality}
											placeholder="Select Locality"
											onChange={(e) => {
												console.log(e.target.value);
												FetchDefintions(e.target.value);
												FetchSubLocalities(e.target.value);
												FetchPrefilledFieldOptions(e.target.value);
												FetchPrefilledLocalityUnits(e.target.value);
												setFieldValue("locality", e.target.value);
											}}
											onBlur={handleBlur}
											error={errors.locality}
											touched={touched.locality}
										/>
										{!isSubLocalityLoading && !!sublocality.length && (
											<StyledSelect
												id="SubLocality"
												label="Sub Locality"
												type="text"
												formClassName="col-md-6"
												name="sub_locality"
												value={values.sub_locality}
												options={sublocality}
												placeholder="Select Sub-Locality"
												onChange={(e) => {
													console.log(e.target.value);
													setFieldValue("sub_locality", e.target.value);
												}}
												onBlur={handleBlur}
												error={errors.sub_locality}
												touched={touched.sub_locality}
											/>
										)}
									</div>
									<div className="row">
										<StyledAddressInput
											id="address"
											label="Address"
											type="text"
											formClassName="col-md-12"
											name="address"
											value={values.address}
											placeholder="Enter Address"
											onHandleChange={(e) => {
												console.log("vvv--->", e);
												setFieldValue("address", e.address);
												setFieldValue("latitude", e.latitude);
												setFieldValue("longitude", e.longitude);
											}}
											onBlur={handleBlur}
											error={errors.address}
											touched={touched.address}
										/>
									</div>

									<div className="row">
										<StyledInput
											id="latitude"
											label="Latitude"
											type="text"
											formClassName="col-md-6"
											name="latitude"
											value={values.latitude}
											placeholder="Enter Latitude"
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.latitude}
											touched={touched.latitude}
										/>
										<StyledInput
											id="longitude"
											label="Longitude"
											type="text"
											formClassName="col-md-6"
											name="longitude"
											value={values.longitude}
											placeholder="Enter Longitude"
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.longitude}
											touched={touched.longitude}
										/>
									</div>

									<div className="row">
										<div className="col-sm">
											<label>Responding Units</label>
											{!isPrefilledUnitsLoading && (
												<CreatableSelect
													isMulti
													placeholder="Enter Responding Units"
													onChange={handleC}
													options={prefilledUnits}
													value={values.responding_units && fetchRData()}
													isClearable={false}
												/>
											)}
										</div>
										<div className="col-sm mt-25">
											<div className="custom-control custom-checkbox mb-25">
												<input
													className="custom-control-input"
													id="featured"
													name="featured"
													value={values.featured}
													checked={values.featured}
													type="checkbox"
													onChange={(e) => setSubValue(e.target.checked)}
													onBlur={handleBlur}
												/>
												<label
													className="custom-control-label font-14"
													htmlFor="featured"
												>
													{" "}
													Featured
												</label>
											</div>
										</div>
									</div>

									{definitions && !isPrefilledFieldOptionsLoading && (
										<>
											<div className="row">
												{definitions["field1_name"] &&
													!!prefilledFieldOptions1.length && (
														<div className="form-group col-md-6">
															<label>
																{definitions
																	? definitions["field1_name"]
																	: "field1_value"}
															</label>
															<CreatableSelect
																onChange={(v) =>
																	handleFieldChange(
																		"field1_value",
																		v
																	)
																}
																options={prefilledFieldOptions1}
																value={values.field1_value}
													isClearable={false}
															/>
														</div>
													)}
												{definitions["field1_name"] &&
													!prefilledFieldOptions1.length && (
														<StyledInput
															id="field1_value"
															label={
																definitions
																	? definitions["field1_name"]
																	: "-"
															}
															type="text"
															formClassName="col-md-6"
															name="field1_value"
															value={values.field1_value}
															// placeholder="Enter field1_value"
															onChange={handleChange}
															onBlur={handleBlur}
															error={errors.field1_value}
															touched={touched.field1_value}
														/>
													)}
												{definitions["field2_name"] &&
													!!prefilledFieldOptions2.length && (
														<div className="form-group col-md-6">
															<label>
																{definitions
																	? definitions["field2_name"]
																	: "field2_value"}
															</label>
															<CreatableSelect
																onChange={(v) =>
																	handleFieldChange(
																		"field2_value",
																		v
																	)
																}
																options={prefilledFieldOptions2}
																value={values.field2_value}
													isClearable={false}
															/>
														</div>
													)}
												{definitions["field2_name"] &&
													!prefilledFieldOptions2.length && (
														<StyledInput
															id="field2_value"
															label={
																definitions
																	? definitions["field2_name"]
																	: "-"
															}
															type="text"
															formClassName="col-md-6"
															name="field2_value"
															value={values.field2_value}
															// placeholder="Enter field2_value"
															onChange={handleChange}
															onBlur={handleBlur}
															error={errors.field2_value}
															touched={touched.field2_value}
														/>
													)}
											</div>
											<div className="row">
												{definitions["field3_name"] &&
													!!prefilledFieldOptions3.length && (
														<div className="form-group col-md-6">
															<label>
																{definitions
																	? definitions["field3_name"]
																	: "field3_value"}
															</label>
															<CreatableSelect
																onChange={(v) =>
																	handleFieldChange(
																		"field3_value",
																		v
																	)
																}
																options={prefilledFieldOptions3}
																value={values.field3_value}
													isClearable={false}
															/>
														</div>
													)}
												{definitions["field3_name"] &&
													!prefilledFieldOptions3.length && (
														<StyledInput
															id="field3_value"
															label={
																definitions
																	? definitions["field3_name"]
																	: "-"
															}
															type="text"
															formClassName="col-md-6"
															name="field3_value"
															value={values.field3_value}
															// placeholder="Enter field3_value"
															onChange={handleChange}
															onBlur={handleBlur}
															error={errors.field3_value}
															touched={touched.field3_value}
														/>
													)}
												{definitions["field4_name"] &&
													!!prefilledFieldOptions4.length && (
														<div className="form-group col-md-6">
															<label>
																{definitions
																	? definitions["field4_name"]
																	: "field4_value"}
															</label>
															<CreatableSelect
																onChange={(v) =>
																	handleFieldChange(
																		"field4_value",
																		v
																	)
																}
																options={prefilledFieldOptions4}
																value={values.field4_value}
													isClearable={false}
															/>
														</div>
													)}
												{definitions["field4_name"] &&
													!prefilledFieldOptions4.length && (
														<StyledInput
															id="field4_value"
															label={
																definitions
																	? definitions["field4_name"]
																	: "-"
															}
															type="text"
															formClassName="col-md-6"
															name="field4_value"
															value={values.field4_value}
															// placeholder="Enter field4_value"
															onChange={handleChange}
															onBlur={handleBlur}
															error={errors.field4_value}
															touched={touched.field4_value}
														/>
													)}
											</div>
											<div className="row">
												{definitions["field5_name"] &&
													!!prefilledFieldOptions5.length && (
														<div className="form-group col-md-6">
															<label>
																{definitions
																	? definitions["field5_name"]
																	: "field5_value"}
															</label>
															<CreatableSelect
																onChange={(v) =>
																	handleFieldChange(
																		"field5_value",
																		v
																	)
																}
																options={prefilledFieldOptions5}
																value={values.field5_value}
													isClearable={false}
															/>
														</div>
													)}
												{definitions["field5_name"] &&
													!prefilledFieldOptions5.length && (
														<StyledInput
															id="field5_value"
															label={
																definitions
																	? definitions["field5_name"]
																	: "-"
															}
															type="text"
															formClassName="col-md-6"
															name="field5_value"
															value={values.field5_value}
															// placeholder={"Enter field5_value"}
															onChange={handleChange}
															onBlur={handleBlur}
															error={errors.field5_value}
															touched={touched.field5_value}
														/>
													)}
											</div>
										</>
									)}

									<button
										className="btn btn-primary mt-2"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Loading..." : "Create"}
									</button>
								</form>
							</div>
						</div>
					</section>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default withPrivateRoute(CreateIncident);
