import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useFormik, yupToFormErrors } from "formik";
import { MapPin } from "react-feather";
import { object, number, string, array, boolean } from "yup";
import CreatableSelect from "react-select/creatable";
import Script from "next/script";
import config from "config";
import { GoogleMap } from "components/form/GoogleMap";
import Cookie from "js-cookie";

import withPrivateRoute from "components/wrapper/withPrivateRoute";
import DashboardLayout from "components/layout/dashboard/layout";
import StyledInput, { StyledSelect } from "components/form/StyledInput";
import { useAuth } from "services/apiService";
import { useRouter } from "next/router";
import { Pages } from "utils/constants";
import addressParser from "../../../server/src/utils/addressParser";

const d = console.debug;
const FB_VERSION = 'v18.0';

const CreateIncident = ({ incidentId = null, userData = null }) => {
	const router = useRouter();
	const {
		createNewIncident,
		fetchAdminLocality,
		fetchLocalityDefinitions,
		fetchSublocality,
		fetchPrefilledFieldOptions,
		fetchPrefilledLocalityUnits,
		fetchSingleIncident,
		updateIncident,
		currentUser,
		deleteIncident,
	} = useAuth();
  const [errorMessage,setErrorMessage] = useState(null);
	const [locality, setLocality] = useState([]);
	const [chosenLocality, setChosenLocality] = useState(null);
	const [sublocality, setSublocality] = useState([]);
	const [street, setStreet] = useState([]);
	const [prefilledFieldOptions, setPrefilledFieldOptions] = useState([]);
	const [prefilledUnits, setPrefilledUnits] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubLocalityLoading, setIsSubLocalityLoading] = useState(false);
	const [isPrefilledFieldOptionsLoading, setIsPrefilledFieldOptionsLoading] = useState(false);
	const [isPrefilledUnitsLoading, setIsPrefilledUnitsLoading] = useState(false);
	const [definitions, setDefinitions] = useState(null);
	const [incidentData, setIncidentData] = useState(null);
	const [initialUserAddress, setInitialUserAddress] = useState(null);
	const [performSearchFunction, setPerformSearchFunction] = useState(null);
	const [doneLoadingIncidentInfo, setDoneLoadingIncidentInfo] = useState(false);
	const [pageTitle, setPageTitle] = useState(
		incidentId ? `Edit Incident ${incidentId}` : "Create Incident"
	);
	const [createdBy, setCreatedBy] = useState("");
	const [createdByEmail, setCreatedByEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [needTwitter, setNeedTwitter] = useState(false);
  const [appId, setAppId] = useState(null);
  const [fwToken, setFwToken] = useState('');
  const [facebookPages,setFacebookPages] = useState([]);
  const [selectedFacebookPages,setSelectedFacebookPages] = useState([]);
  const [selectedTwitterPages,setSelectedTwitterPages] = useState([]);
  const [twitterPages,setTwitterPages] = useState([]);

  const parseToken = async () => {
    try {
		  const user = await Cookie.get(config.userKey) ? JSON.parse(Cookie.get(config.userKey)) : null;
      if (!user || !user.isAdmin) {
        setIsAdmin(false);
      }else{
        setIsAdmin(true);
      }
      setFwToken(user.token);
    }catch(e){
      //setIsAdmin(false);
      //setFwToken(null);
    }
  };
	const fetchUserLocality = async () => {
		const { isError, data, error } = await fetchAdminLocality(currentUser.email);
		console.debug({ data });
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
			locality: incidentId ? userData.locality : "",
			sub_locality: incidentId ? userData.sub_locality : "",
			street: "",
			address: incidentId ? userData.address : "",
			longitude: incidentId ? userData.longitude : "",
			latitude: incidentId ? userData.latitude : "",
			field1_value: incidentId ? userData.field1_value : "",
			field2_value: incidentId ? userData.field2_value : "",
			field3_value: incidentId ? userData.field3_value : "",
			field4_value: incidentId ? userData.field4_value : "",
			field5_value: incidentId ? userData.field5_value : "",
			responding_units: incidentId ? userData.responding_units : [],
			featured: incidentId ? userData.featured : false,
			send_push_notification: incidentId ? false : true,
		},
		validationSchema: object().shape({
			locality: string().required("Locality is required"),
			sub_locality: string().required("Sub Locality is Required"),
			street: string().optional(),
			address: string().required("Address is required"),
			longitude: number().required("Longitude is required"),
			latitude: number().required("Latitude is required"),
			field1_value: string().nullable().optional(),
			field2_value: string().nullable().optional(),
			field3_value: string().nullable().optional(),
			field4_value: string().nullable().optional(),
			field5_value: string().nullable().optional(),
			responding_units: array().of(string()),
			featured: boolean().default(false),
			send_push_notification: boolean().default(incidentId ? false : true),
		}),
		onSubmit: async (formData) => {
      formData.facebook_pages = fetchSelectedFacebookPages();
      formData.twitter = fetchSelectedTwitter();
			d(`onSubmit`, { formData });
			setSubmitting(true);
      setErrorMessage(null);
			let resp;
			if (incidentId) {
				resp = await updateIncident(incidentId, formData);
			} else {
				resp = await createNewIncident(formData);
			}
			const { isError, data, error } = resp;
			console.log(isError, data, error);
			if (isError) {
				toast.error(error.message);
        setErrorMessage(error.message);
			} else {
				toast.success("success");
        setErrorMessage(null);
				return router.push(`/${Pages.INCIDENT}`);
			}
			setSubmitting(false);
		},
	});
	//d({ userData, values, incidentId });
	useEffect(() => {
		d({ label: 'u_dat', userData });
		if (isAdmin && userData && userData.createdBy) {
			setCreatedByEmail(userData.createdBy.email);
			setCreatedBy(
				[userData.createdBy.first_name, " ", userData.createdBy.last_name].join("")
			);
		}
	}, [userData,isAdmin]);
	const SetLocality = async (_loc) => {
		setChosenLocality(_loc);
		FetchDefinitions(_loc);
		FetchSubLocalities(_loc);
		FetchPrefilledFieldOptions(_loc);
		FetchPrefilledLocalityUnits(_loc);
		setFieldValue("locality", _loc);
    let resp = await getFacebookPages(_loc);
    setFacebookPages(resp.data.pages);
    setTwitterPages(resp.data.twitter_pages);
    d({label: 'fb_dat',resp});
	};
	const SetSubLocality = (_sl) => {
		setFieldValue("sub_locality", _sl);
	};
	const SetAddress = (addr, lat, longitude) => {
		if (typeof addr === "undefined" || addr === null || addr.length === 0) {
			setFieldValue("street", "");
			setFieldValue("address", "");
			setFieldValue("latitude", "");
			setFieldValue("longitude", "");
		} else {
			setFieldValue("street", addressParser(addr));
			setFieldValue("address", addr);
			setFieldValue("latitude", lat);
			setFieldValue("longitude", longitude);
		}
	};

	const FetchDefinitions = async (id) => {
		const { isError, data, error } = await fetchLocalityDefinitions(id);
		if (isError) toast.error(error.data.message);
		else setDefinitions(data);
		setIsLoading(false);
	};

	const FetchSubLocalities = async (id) => {
		setIsSubLocalityLoading(true);
		const { isError, data, error } = await fetchSublocality(id, 1, 700);
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
		const { isError, data, error } = await fetchPrefilledFieldOptions(id, 1, 700);
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
  const getFacebookPages = async (localityID) => {
    await parseToken();
		let resp = await fetch(`/api/v1/localities/${localityID}/push-setup`,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + fwToken,
			},
		}).then(async (r) => {
      return await r.json();
		}).then(async (jsonResponse) => {
      return await jsonResponse;
    }).catch((err) => {
      console.error(`Unable to fetch facebook app ID!`,err);
      return null;
    });
    return resp;
  };
  const fetchFbAppId = async () => {
    await parseToken();
		let appId = await fetch("/api/v1/auth/fb/app-id", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + fwToken,
			},
		}).then(async (r) => {
      return await r.json();
		}).then(async (jsonResponse) => {
      return await jsonResponse.data.data;
    }).catch((err) => {
      console.error(`Unable to fetch facebook app ID!`,err);
      return null;
    });
    return appId;
  };

  const fetchSelectedTwitter = () => {
    let pages = [];
    for(const page of selectedTwitterPages){
      if(pages.indexOf(page) > -1){
        continue;
      }
      pages.push(page);
    }
    return pages;
  }
  const fetchSelectedFacebookPages = () => {
    let pages = [];
    for(const page of selectedFacebookPages){
      if(pages.indexOf(page) > -1){
        continue;
      }
      pages.push(page);
    }
    return pages;
  };

	useEffect(async () => {
		await fetchUserLocality();
		if (incidentId) {
			setDoneLoadingIncidentInfo(false);
			fetchSingleIncident(incidentId).then((resp) => {
				d({ resp });
				setIncidentData(resp.data);
				if (resp.isError) {
					console.error(`fetchSingleIncident:`, resp.error);
					return;
				}
				SetLocality(resp.data.locality);
				SetSubLocality(resp.data.sub_locality);
				SetAddress(resp.data.address, resp.data.latitude, resp.data.longitude);
				setFieldValue("responding_units", resp.data.responding_units);
				for (const n of [1, 2, 3, 4]) {
					handleFieldChange(`field${n}_value`, resp.data[`field${n}_value`]);
				}
				setInitialUserAddress(resp.data.address);
				setDoneLoadingIncidentInfo(true);
			});
		} else {
			setDoneLoadingIncidentInfo(true);
		}
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		})(document, "script", "facebook-jssdk");
    fetchFbAppId().then((r) => {
      console.debug({r});
      setAppId(r);
    });
		window.fbAsyncInit = function () {
			// <!-- Initialize the SDK with your app and the Graph API version for your app -->
			FB.init({
				appId: appId,
				xfbml: true,
				version: FB_VERSION,
			});
    };
	}, []);
	console.log("errors-->", errors);
	const fetchRData = () => {
		const g = values.responding_units;
		let f = g.map((r) => {
			return { label: r, value: r };
		});
		return f;
	};
	useEffect(async () => {
		if (!chosenLocality) {
			return;
		}
    await parseToken();
    let resp = await getFacebookPages(chosenLocality);
    setFacebookPages(resp.data.pages);
    setTwitterPages(resp.data.twitter_pages);
	}, [chosenLocality]);
	const confirmDelete = (e) => {
		e.preventDefault();
		if (confirm("Are you sure you want to delete this incident? This cannot be undone")) {
			deleteIncident(incidentId)
				.then(() => {
					window.location.href = "/incident";
				})
				.catch(() => {
					window.location.href = "/incident";
				});
		}
		return false;
	};
	const startFacebookLogin = (e) => {
    e.preventDefault();
			// <!-- Initialize the SDK with your app and the Graph API version for your app -->
			FB.init({
				appId: appId,
				xfbml: true,
				version: FB_VERSION,
			});
			//<!-- If you are logged in, automatically get your name and email adress, your public profile information -->
			FB.login(
				async function (response) {
					if (response.authResponse) {
						console.log(JSON.stringify(response, null, 2));
						console.log("Welcome!  Fetching your information.... ");
						let aresp = response.authResponse;
						aresp.fwLocalityID = chosenLocality;
            //console.debug({chosenLocality});
						let status = fetch("/api/v1/users/fb", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + fwToken,
							},
							body: JSON.stringify(aresp),
						}).then(async (r) => {
              return await r.json();
						}).then(async (jsonResponse) => {
              window.location.reload();
              return await jsonResponse;
            }).catch((err) => {
              console.error(`Issue saving fb user tokens:`,err);
              return null;
            });
            console.debug({status});
					} else {
						// <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
						console.log("User cancelled login or did not fully authorize.");
					}
				},
				{
					scope: [
						"public_profile",
						"email",
						"pages_manage_posts",
						"pages_manage_metadata",
						"pages_read_engagement",
						"pages_read_user_content",
						"pages_show_list",
					].join(","),
				}
			);
		console.log("TODO");
	};
	const startTwitterLogin = () => {
		console.log("TODO");
	};

	const prefilledFieldOptions1 = prefilledFieldOptions.filter((f) => f.field_number === 1);
	const prefilledFieldOptions2 = prefilledFieldOptions.filter((f) => f.field_number === 2);
	const prefilledFieldOptions3 = prefilledFieldOptions.filter((f) => f.field_number === 3);
	const prefilledFieldOptions4 = prefilledFieldOptions.filter((f) => f.field_number === 4);
	const prefilledFieldOptions5 = prefilledFieldOptions.filter((f) => f.field_number === 5);

  const facebookPageChange = (e) => {
    let target= e.currentTarget;
    let pageId = target.name.replace('fbpagecb-','');
    if(target.checked){
      setSelectedFacebookPages([...selectedFacebookPages,pageId]);
      return;
    }
    setSelectedFacebookPages(selectedFacebookPages.filter((i) => i === pageId));
  };
  const twitterPageChange = (e) => {
    let target= e.currentTarget;
    let pageId = target.name.replace('twitter-','');
    if(target.checked){
      setSelectedTwitterPages([...selectedTwitterPages,pageId]);
      return;
    }
    setSelectedTwitterPages(selectedTwitterPages.filter((i) => i === pageId));
  };
  const formatFriendlyDate = (d) => {
    let date = new Date(d);
    return date.toLocaleDateString();
  };

  const facebookPageLinks = (pages) => {
    let unique = [];
    if(!Array.isArray(pages) || !pages || pages.length === 0){
      return (<b>No facebook pages</b>);
    }
    for(const page of pages){
      if(unique.indexOf(page) === -1){
        unique.push(page);
      }
    }
    return unique.map(page => {
      return (
        <>
          <input name={`fbpagecb-${page.page_id}`} type="checkbox" onChange={facebookPageChange}/>
          <label className="facebook-page-name" for={`fbpagecb-${page.page_id}`}><b>{page.page_name}</b></label>
          <br/>
        </>
      );
    });
  };
  const twitterPageLinks = (pages) => {
    let unique = [];
    if(!Array.isArray(pages) || !pages || pages.length === 0){
      return (<b>No Twitter accounts</b>);
    }
    for(const page of pages){
      if(unique.indexOf(page) === -1){
        unique.push(page);
      }
    }
    return unique.map(page => {
      return (
        <>
          <input name={`twitter-${page.page_id}`} type="checkbox" onChange={twitterPageChange}/>
          <label className="twitter-page-name" for={`twitter-${page.page_id}`}><b>{page.page_name}</b></label>
          <br/>
        </>
      );
    });
  };

	return (
		<DashboardLayout pageTitle={pageTitle}>
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<MapPin />
					</span>
					{pageTitle}
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
									{incidentId && isAdmin && (
										<>
											<div className="row">
												<div style={{ paddingLeft: "1em" }}>
													Created by:{" "}
													<a href={`/users/${createdByEmail}`}>
														{createdBy} ({createdByEmail})
													</a>
												</div>
												<br />
												<br />
											</div>
											<div className="row">
												<div style={{ paddingLeft: "1em" }}>
													<button onClick={confirmDelete}>
														Delete Incident
													</button>
												</div>
												<br />
											</div>
										</>
									)}
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
												SetLocality(e.target.value);
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
													SetSubLocality(e.target.value);
												}}
												onBlur={handleBlur}
												error={errors.sub_locality}
												touched={touched.sub_locality}
											/>
										)}
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
													id="send_push_notification"
													name="send_push_notification"
													value={values?.send_push_notification}
													checked={values?.send_push_notification}
													type="checkbox"
													onChange={(e) =>
														setFieldValue(
															"send_push_notification",
															e.target.checked
														)
													}
													onBlur={handleBlur}
												/>
												<label
													className="custom-control-label font-14"
													htmlFor="send_push_notification"
												>
													{" "}
													Send Push Notification
												</label>
                        <br/>
                        <br/>
                        {chosenLocality && isAdmin && Array.isArray(facebookPages) && facebookPages.length > 0 && (
                          <>
                            <br/>
                            <u>Post to Facebook Page(s)</u>
                            <br/>
                            {facebookPageLinks(facebookPages)}
                            <br/>
                          </>
                        )}
                        {chosenLocality && isAdmin && Array.isArray(facebookPages) &&   facebookPages.length === 0 && (
                          <>
                            <b className="warning">No active Facebook pages</b>
                          </>
                        )}
                        {chosenLocality && isAdmin && (
													<>
														<button onClick={startFacebookLogin}>
                              Click here to link a Facebook page
														</button>
													</>
                        )}
												{chosenLocality && isAdmin && Array.isArray(twitterPages) && twitterPages.length > 0 && (
													<>
                            <br/>
                            <u>Post to Twitter profile(s)</u>
                            <br/>
                            {twitterPageLinks(twitterPages)}
                            <br/>
													</>
												)}
											</div>
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
																		v.value
																	)
																}
																options={prefilledFieldOptions1}
																value={{
																	label: values.field1_value,
																	value: values.field1_value,
																}}
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
																value={{
																	label: values.field2_value,
																	value: values.field2_value,
																}}
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
																value={{
																	label: values.field3_value,
																	value: values.field3_value,
																}}
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
																value={{
																	label: values.field4_value,
																	value: values.field4_value,
																}}
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

									<div className="row">
										{incidentId && doneLoadingIncidentInfo && (
											<GoogleMap
												id="address"
												label="Address"
												placeholder="Enter Address"
												formClassName="col-md-6"
												onHandleChange={(e) => {
													SetAddress(e.address, e.latitude, e.longitude);
												}}
												showNow={true}
												value={initialUserAddress}
											/>
										)}
										{!incidentId && (
											<GoogleMap
												id="address"
												label="Address"
												placeholder="Enter Address"
												formClassName="col-md-6"
												onHandleChange={(e) => {
													SetAddress(e.address, e.latitude, e.longitude);
												}}
											/>
										)}
									</div>
									<div className="row">
										<StyledInput
											id="street"
											label="Street"
											type="text"
											formClassName="col-md-12"
											name="street"
											value={values.street}
											placeholder="Enter Street"
											onChange={handleChange}
											onBlur={handleBlur}
											error={errors.street}
											touched={touched.street}
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
										<button
											className="btn btn-primary mt-2"
											type="submit"
											disabled={isSubmitting}
										>
											{isSubmitting
												? "Loading..."
												: incidentId
												? "Update"
												: "Create"}
										</button>
									</div>
                  <div className="row">
                    {errorMessage && <b className="error">{errorMessage}</b>}
                  </div>
								</form>
							</div>
						</div>
					</section>
				</div>
    {appId !== null && (
      <script crossOrigin="anonymous" src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=${appId}`} nonce="I90kOdi4"></script>
    )}
			</div>
		</DashboardLayout>
	);
};

export default withPrivateRoute(CreateIncident);
