import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import { object, number, string, boolean } from "yup";
import Link from "next/link";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";
import CustomModal from "components/modal";
import StyledInput from "components/form/StyledInput";

const display_value = (v) => {
  if(!v){
    return '-';
  }
  return '******';
}
const FetchLocalityDetailsPage = () => {
	const router = useRouter()
	const { id } = router.query
	const { fetchLocalityById, fetchLocalityDefinitions } = useAuth();
	const [ isLoading, setIsLoading ] = useState(true);
	const [ showEdit, setShowEdit ] = useState(false);
	const [ userData, setUserData ] = useState({});
	const [ definitions, setDefinitions ] = useState({});
	const [ component, setComponent ] = useState(null);

	const FetchLocality = async () => {
		// if (id){
			const { isError, data, error } = await fetchLocalityById(id);
			if (isError) {
				console.log(error, id)
				toast.error(error.data.message)
				router.push(`/${Pages.LOCALITY}`, {
					message: "Locality not Found"
				})
			} else {
				setUserData(data)
				console.log(data)
			}
			setIsLoading(false)
		// }
	}

	const FetchDefintions = async ()=> {
		const { isError, data, error } = await fetchLocalityDefinitions(id);
		if (isError) {
			console.log(error, id)
			toast.error(error.data.message)
		} else {
			setDefinitions(data)
		}
		setIsLoading(false)
	}
	const SetModalView = (t, c) => {
		setComponent(c)
		setShowEdit(t);
	}

	useEffect(async ()=>{
		await FetchLocality();
		await FetchDefintions();
	},[id, showEdit])
	return(
		<DashboardLayout pageTitle={"Locality"} isLoading={isLoading}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title"><span className="pg-title-icon"><span className="feather-icon"><i data-feather="book"></i></span></span>Locality Settings</h4>
				</div>
				<div className="d-flex button-list">
					<button onClick={()=>SetModalView(true, <EditLocalityForm data={userData} closeModal={()=>SetModalView(false, null)}/>)} className="btn btn-primary btn-sm">Edit Locality</button>
					<button onClick={()=>SetModalView(true, <LocalityDefinitionForm usData={userData} data={definitions} closeModal={()=>SetModalView(false, null)}/>)} className="btn btn-primary btn-sm">{definitions ? "Edit" : "Add" } Definitions</button>
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>Name</span>
						<h3>{userData?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>State</span>
						<h3>{userData?.state || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Longitude</span>
						<h3>{userData?.longitude || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Latitude</span>
						<h3>{userData?.latitude || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Subscriber Only Comment</span>
						<h3>{userData?.subscriber_only_comments ? "true" : "false"}</h3>
					</div>
					<div className="col-sm">
						<span>News Url</span>
						<h3>{userData?.news_rss_feed_url || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Twitter Description</span>
						<h3>{userData?.twitter_page_name || "-"}</h3>
					</div>
        </div>
				<div className="row">
					<div className="col-sm">
						<span>Twitter API Key</span>
						<h4>{display_value(userData?.twitter_api_key)}</h4>
					</div>
					<div className="col-sm">
						<span>Twitter API Secret</span>
						<h4>{display_value(userData?.twitter_api_secret)}</h4>
					</div>
        </div>
				<div className="row">
					<div className="col-sm">
						<span>Twitter Access Token</span>
						<h4>{display_value(userData?.twitter_access_token)}</h4>
					</div>
					<div className="col-sm">
						<span>Twitter Access Token Secret</span>
						<h4>{display_value(userData?.twitter_access_token_secret)}</h4>
					</div>
					<div className="col-sm">
						<span>Twitter Bearer Token</span>
						<h4>{display_value(userData?.twitter_bearer_token)}</h4>
					</div>
					<div className="col-sm"></div>
				</div>
			</section>
			{/* Incident Definition */}
			{definitions && 
			<>
				<div className="hk-pg-header mb-10">
					<div>
						<h4 className="hk-pg-title"><span className="pg-title-icon"><span className="feather-icon"><i data-feather="book"></i></span></span>Incident Definitions</h4>
					</div>
				</div>
				<section className="hk-sec-wrapper">
					<div className="row">
						<div className="col-sm">
							<span>Field One</span>
							<h3>{definitions?.field1_name || "-"}</h3>
						</div>
						<div className="col-sm">
							<span>Field Two</span>
							<h3>{definitions?.field2_name || "-"}</h3>
						</div>
						<div className="col-sm">
							<span>Field Three</span>
							<h3>{definitions?.field3_name || "-"}</h3>
						</div>
					</div>
					<hr />
					<div className="row">
						<div className="col-sm">
							<span>Field Four</span>
							<h3>{definitions?.field4_name || "-"}</h3>
						</div>
						<div className="col-sm">
							<span>Field Five</span>
							<h3>{definitions?.field5_name || "-"}</h3>
						</div>
						<div className="col-sm"></div>
					</div>
				</section>
			</>}
			{showEdit && <CustomModal centered={true} component={component} show={showEdit} title={"Edit Locality"} closeModal={()=>SetModalView(false, null)}/>}
		</DashboardLayout>
	)
};

const EditLocalityForm = ({ data, closeModal }) => {
	const fD = data;
	const { updateNewLocality } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched, setFieldValue } = useFormik({
		initialValues: {
            name: data?.name || "",
            state: data?.state ||  "",
			longitude: data?.longitude ||  "",
			latitude: data?.latitude || "",
			subscriber_only_comments: data?.subscriber_only_comments || false,
			facebook_graph_token: data?.facebook_graph_token || "",
			twitter_access_token: data?.twitter_access_token || "",
			twitter_access_token_secret: data?.twitter_access_token_secret || "",
			twitter_api_key: data?.twitter_api_key || "",
			twitter_api_secret: data?.twitter_api_secret || "",
      twitter_bearer_token: data?.twitter_bearer_token || "",
      twitter_page_name: data?.twitter_page_name || "",
			news_rss_feed_url: data?.news_rss_feed_url || "",
		},
		validationSchema: object().shape({
            name: string().required("Name is required"),
            state: string().required("State is required"),
			longitude: number().required("Longitude is required"),
			latitude: number().required("Latitude is required"),
			subscriber_only_comments: boolean().default(false),
			facebook_graph_token: string(),
			twitter_access_token:  string(),
			twitter_access_token_secret:  string(),
			twitter_api_key:  string(),
			twitter_api_secret:  string(),
      twitter_page_name: string(),
      twitter_bearer_token: string(),
			news_rss_feed_url:  string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await updateNewLocality(fD.id, formData);
			setSubmitting(false);
			if (isError) toast.error(error.message);
			else {
				toast.success("success");
				closeModal()
			}
		}, 
	});
	const setSubValue = (v) => setFieldValue("subscriber_only_comments", v);
	console.log(values.subscriber_only_comments)
	return(
		<form onSubmit={handleSubmit} autocomplete="off">
			<div className="row">
				<StyledInput 
					id="Name"
					label="Name"
					type="text"
					name="name"
					formClassName="col-md-6"
					value={values.name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.name}
					touched={touched.name}
				/>
				<StyledInput 
					id="State"
					label="State"
					type="text"
					name="state"
					formClassName="col-md-6"
					value={values.state}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.state}
					touched={touched.state}
				/>	
			</div>
			<div className="row">
				<StyledInput 
					id="Longitude"
					label="Longitude"
					type="number"
					name="longitude"
					formClassName="col-md-6"
					value={values.longitude}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.longitude}
					touched={touched.longitude}
				/>
				<StyledInput 
					id="Latitude"
					label="Latitude"
					type="number"
					name="latitude"
					formClassName="col-md-6"
					value={values.latitude}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.latitude}
					touched={touched.latitude}
				/>	
			</div>
			<div className="custom-control custom-checkbox mb-25">
                <input
                    className="custom-control-input"
                    id="subscriber_only_comments"
					name="subscriber_only_comments"
					value={values.subscriber_only_comments}
					checked={values?.subscriber_only_comments}
                    type="checkbox"
					onChange={(e)=>setSubValue(e.target.checked)}
					onBlur={handleBlur}
                /> 
				<label className="custom-control-label font-14" htmlFor="subscriber_only_comments"> Subscriber Only Comment</label>
            </div>
			<div className="row">
        <div className="custom-control">
          <b>For security purposes, the actual length of the Twitter credentials below will not reflect what is actually stored in the database. If the lengths of the inputs look wrong, <u>that is intentional.</u></b>
        </div>
				<StyledInput 
					id="news_rss_feed_url"
					label="News RSS Feed Url"
					type="text"
					name="news_rss_feed_url"
					formClassName="col-md-6"
					value={values.news_rss_feed_url}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.news_rss_feed_url}
					touched={touched.news_rss_feed_url}
				/>
				<StyledInput 
					id="twitter_page_name"
					label="Twitter Description"
					type="text"
					name="twitter_page_name"
					formClassName="col-md-6"
          placeholder="i.e.: main nyc firewire page"
					value={values.twitter_page_name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_page_name}
					touched={touched.twitter_page_name}
				/>
				<StyledInput 
					id="twitter_access_token"
					label="Twitter Access Token"
					type="password"
					name="twitter_access_token"
					formClassName="col-md-6"
					value={values.twitter_access_token}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_access_token}
					touched={touched.twitter_access_token}
				/>
				<StyledInput 
					id="twitter_access_token_secret"
					label="Twitter Access Token Secret"
					type="password"
					formClassName="col-md-6"
					name="twitter_access_token_secret"
					value={values.twitter_access_token_secret}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_access_token_secret}
					touched={touched.twitter_access_token_secret}
				/>
			</div>
			<div className="row">
				<StyledInput 
					id="twitter_api_key"
					label="Twitter API Key"
					type="password"
					formClassName="col-md-6"
					name="twitter_api_key"
					value={values.twitter_api_key}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_api_key}
					touched={touched.twitter_api_key}
				/>
				<StyledInput 
					id="twitter_api_secret"
					label="Twitter API Secret"
					type="password"
					formClassName="col-md-6"
					name="twitter_api_secret"
					value={values.twitter_api_secret}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_api_secret}
					touched={touched.twitter_api_secret}
				/>
				<StyledInput 
					id="twitter_bearer_token"
					label="Twitter Bearer Token"
					type="password"
					formClassName="col-md-6"
					name="twitter_bearer_token"
					value={values.twitter_bearer_token}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_bearer_token}
					touched={touched.twitter_bearer_token}
				/>
			</div>
      <span className="note"><b>NOTE:</b>To add a facebook page, go to the create incident page</span>
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." :"Save" }</button>
		</form>
	)
}

const LocalityDefinitionForm = ({ usData, data, closeModal }) => {
	const fD = usData;
	const { updateLocalityDefinitions } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched, setFieldValue } = useFormik({
		initialValues: {
            field1_name: data?.field1_name || "",
            field2_name: data?.field2_name || "",
            field3_name: data?.field3_name || "",
            field4_name: data?.field4_name || "",
            field5_name: data?.field5_name || "",
		},
		validationSchema: object().shape({
            field1_name: string(),
            field2_name: string(),
            field3_name: string(),
            field4_name: string(),
            field5_name: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await updateLocalityDefinitions(fD.id, formData);
			setSubmitting(false);
			if (isError) toast.error(error.message);
			else {
				toast.success("success");
				closeModal()
			}
		}, 
	});
	return(
		<form onSubmit={handleSubmit} autocomplete="off">
			<div className="row">
				<StyledInput 
					id="field1_name"
					label="Field1 Name"
					type="text"
					name="field1_name"
					formClassName="col-md-6"
					value={values.field1_name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.field1_name}
					touched={touched.field1_name}
				/>
				<StyledInput 
					id="field2_name"
					label="Field2 Name"
					type="text"
					name="field2_name"
					formClassName="col-md-6"
					value={values.field2_name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.field2_name}
					touched={touched.field2_name}
				/>	
			</div>
			<div className="row">
				<StyledInput 
					id="field3_name"
					label="Field3 Name"
					type="text"
					name="field3_name"
					formClassName="col-md-6"
					value={values.field3_name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.field3_name}
					touched={touched.field3_name}
				/>
				<StyledInput 
					id="field4_name"
					label="Field4 Name"
					type="text"
					name="field4_name"
					formClassName="col-md-6"
					value={values.field4_name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.field4_name}
					touched={touched.field4_name}
				/>
			</div>
			<StyledInput 
				id="field5_name"
				label="Field5 Name"
				type="text"
				name="field5_name"
				// formClassName="col-md-6"
				value={values.field5_name}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors.field5_name}
				touched={touched.field5_name}
			/>	
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." :"Save" }</button>
		</form>
	)
}
export default withPrivateRoute(FetchLocalityDetailsPage);
