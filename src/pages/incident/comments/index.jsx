import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Loader, MapPin } from "react-feather";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, number, string, boolean } from "yup";
import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import Pagination from "components/pagination";
import { useAuth } from "services/apiService";
import { Pages } from "utils/constants";
import Button from "components/button";
import { StyledSelect } from "components/form/StyledInput";
import { constants } from "utils";
import CustomModal from "components/modal";
import StyledInput from "components/form/StyledInput";

const IncidentPage = () => {
    const { fetchIncidents, fetchAdminLocality, currentUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [locality, setLocality] = useState([]);
	const [ showEdit, setShowEdit ] = useState(false);
	const [ component, setComponent ] = useState(null);

    useEffect(async()=> {
        await fetchUserLocality();
        await FetchData();
    },[]);

    const fetchUserLocality = async () => {
        const { isError, data, error } = await fetchAdminLocality(currentUser.email);
        console.log(data, error)
        if (isError) toast.error(error.message);
        const l = data.data.map((t)=>{
            return { label: t.name, value: t.id }
        })
        setLocality(l)
    }

    const FetchData = async (l=null) => {
        const { isError, data, error } = await fetchIncidents(l, page, limit);
        if (isError) toast.error(error.message);
        setDatas(data.data)
        setPages(data.pages)
        setLoading(false);
    };

    const routePage = (id, m) => {
        console.log(id);
        if (id) return router.push(`/${Pages.LOCALITY}/${id}${m ? "/"+ m : ""}`);
    }
    const pageNavigate = (page) => setPage(page);
    const fetchByLocality = async (l) => {
        setLoading(true);
        await FetchData(l)
    }

	const SetModalView = (t, c) => {
		setComponent(c)
		setShowEdit(t);
	}

    return (
        <DashboardLayout pageTitle={"Locality"}>
            <div className="hk-pg-header">
                <h4 className="hk-pg-title">
                    <span className="pg-title-icon"><MapPin /></span>
                    Incidents
                </h4>
                <div className="d-flex"><Link href={`/${Pages.INCIDENT}/create`}><button className="btn btn-primary btn-sm">Create New Incident</button></Link>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="row mb-25">
                        <div className="col-sm-3">
                            <StyledSelect 
                                name={"select-locality"}
                                placeholder={"Select Locality"}
                                // label="Select Locality"
                                options={locality}
                                onChange={(e)=>fetchByLocality(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body pa-0">
                            <div className="table-wrap">
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Locality</th>
                                                <th>Address</th>
                                                <th>Latitude</th>
                                                <th>Longitude</th>
                                                <th>Featured</th>
                                                {/* <th>Created BY</th> */}
                                                <th>Created On</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!loading && data.map((u, i)=>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{u?.ilocality?.name}</td>
                                                <td>{u?.address.slice(1, 10)}...</td>
                                                <td>{u?.latitude || "-"}</td>
                                                <td>{u?.longitude || "-"}</td>
                                                <td>{u?.featured ? "true" : "false"}</td>
                                                {/* <td>{u?.createdBy ? u?.createdBy?.first_name +" "+ u?.createdBy?.last_name : "-"}</td> */}
                                                <td>{moment(u?.created_at).format(constants.DATE_FOMAT) || "-"}</td>
                                                <td>
                                                    <Button label="View" variant="info" onClick={()=>router.push(`/${Pages.INCIDENT}/${u.id}`)} />
                                                    <Button label="Comments" variant="info" onClick={()=>router.push(`/${Pages.INCIDENT}/comments/${u.id}`)} />
                                                </td>
                                            </tr>)}
                                            {loading && <tr><td className="text-center" colSpan={10}>
                                                <Loader />
                                                <p>Loading...</p>
                                                </td></tr>}
                                            {!loading && data.length == 0 && <tr><td className="text-center" colSpan={10}>No data</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination currentPage={page} clickAction={pageNavigate} totalPages={pages}/>
			        {showEdit && <CustomModal component={component} show={showEdit} title={"Edit Locality"} closeModal={()=>SetModalView(false, null)}/>}
                </div>
            </div>
        </DashboardLayout>
    )
};

const EditForm = ({ data, closeModal }) => {
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
	console.log(values)
	return(
		<form onSubmit={handleSubmit}>
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
                    type="checkbox"
					onChange={(e)=>setSubValue(e.target.checked)}
					onBlur={handleBlur}
                /> 
				<label className="custom-control-label font-14" htmlFor="subscriber_only_comments"> Subscriber Only Comment</label>
            </div>
			<div className="row">
				<StyledInput 
					id="facebook_graph_token"
					label="Facebook token"
					type="text"
					name="facebook_graph_token"
					formClassName="col-md-6"
					value={values.facebook_graph_token}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.facebook_graph_token}
					touched={touched.facebook_graph_token}
				/>
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
			</div>
			<div className="row">
				<StyledInput 
					id="twitter_access_token"
					label="Twitter Access Token"
					type="text"
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
					label="Twitter Secret Token"
					type="text"
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
					type="text"
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
					type="text"
					formClassName="col-md-6"
					name="twitter_api_secret"
					value={values.twitter_api_secret}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.twitter_api_secret}
					touched={touched.twitter_api_secret}
				/>
			</div>
			<button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." :"Save" }</button>
		</form>
	)
}

export default withPrivateRoute(IncidentPage);
