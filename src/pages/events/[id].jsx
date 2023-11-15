import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import { object, number, string, boolean } from "yup";
import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";
import CustomModal from "components/modal";
import StyledInput, { StyledSelect } from "components/form/StyledInput";
import ConfirmModal from "components/modal/confirmModal";
import { constants } from "utils";

const FetchEventDetailsPage = () => {
	const router = useRouter()
	const { id } = router.query
	const { fetchSingleEvent, fetchLocalityDefinitions, deleteEvent } = useAuth();
	const [ isLoading, setIsLoading ] = useState(true);
	const [ showEdit, setShowEdit ] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirming, setConfirming] = useState(false);
	const [ userData, setUserData ] = useState({});
	const [ component, setComponent ] = useState(null);

	const FetchData = async () => {
		// if (id){
			const { isError, data, error } = await fetchSingleEvent(id);
			if (isError) {
				console.log(error, id)
				toast.error(error.data.message)
				router.push(`/${Pages.EVENT}`, {
					message: "Event not Found"
				})
			} else {
				setUserData(data)
			}
			setIsLoading(false)
		// }
	}

	const SetModalView = (t, c) => {
		setComponent(c)
		setShowEdit(t);
	}

	useEffect(async ()=>{
		await FetchData();
	},[id, showEdit]);

    const startDeleteModal = () => setConfirmModal(true)

	const RemoveIncident = async () => {
        setConfirming(true);
        const { isError, data, error } = await deleteEvent(id);
        if (isError) toast.error(error.message);
        else toast.success("success");
        setConfirming(false)
		router.push(`/${Pages.EVENT}`, {
			message: "Event Deleted"
		})
	}

	return(
		<DashboardLayout pageTitle={"Incident"} isLoading={isLoading}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title"><span className="pg-title-icon"><span className="feather-icon"><i data-feather="book"></i></span></span>Event Detail</h4>
				</div>
				<div className="d-flex button-list">
					<button onClick={()=>SetModalView(true, <EditForm data={userData} closeModal={()=>SetModalView(false, null)}/>)} className="btn btn-info btn-sm">Edit</button>
					<button onClick={()=>startDeleteModal()} className="btn btn-danger btn-sm">Delete</button>
					{confirmModal && <ConfirmModal loading={confirming} show={confirmModal} closeModal={()=>setConfirmModal(false)} nextAction={() => RemoveIncident()} />}
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>Locality</span>
						<h3>{userData?.localityData?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Title</span>
						<h3>{userData?.title || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Description</span>
						<h3>{userData?.description || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Location</span>
						<h3>{userData?.location || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Start Date</span>
						<h3>{userData?.start_date_time ? moment(userData?.start_date_time).format(constants.DATE_FOMAT) : "-"}</h3>
					</div>
					<div className="col-sm">
						<span>End Date</span>
						<h3>{userData?.end_date_time ? moment(userData?.end_date_time).format(constants.DATE_FOMAT): "-"}</h3>
					</div>
				</div>
			</section>
			{showEdit && <CustomModal centered={true} component={component} show={showEdit} title={"Edit Incident"} closeModal={()=>SetModalView(false, null)}/>}
		</DashboardLayout>
	)
};

const EditForm = ({ data, closeModal }) => {
	const [locality, setLocality] = useState([]);
	const fD = data;
	const { updateEvent, fetchAdminLocality, currentUser  } = useAuth();
	
	const { values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, setSubmitting, errors, touched } = useFormik({
		initialValues: {
            locality: data?.locality || "",
            title: data?.title || "",
			description: data?.description || "",
			location: data?.location || "",
			start_date_time: data?.start_date_time || "",
			end_date_time: data?.end_date_time || "",
		},
		validationSchema: object().shape({
            locality: string().required("Locality is required"),
            title: string().required("title is required"),
			description: string().required("Description is required"),
			location: string().required("Location is required"),
			start_date_time: string().required(),
			end_date_time: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await updateEvent(fD.id, formData);
            console.log(isError, data, error)
			if (isError) {
				toast.error(error.message);
			} else {
				toast.success("success");
                closeModal();
			}
			// setSubmitting(false);
		},
	});
    const fetchUserLocality = async () => {
        const { isError, data, error } = await fetchAdminLocality(currentUser.email);
        if (isError) toast.error(error.message);
        const l = data.data.map((t)=>{
            return { label: t.name, value: t.id }
        })
        setLocality(l)
    }
    
    useEffect(async()=>{
        await fetchUserLocality()
    },[])
	return(
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
                        console.log(e.target.value)
                        setFieldValue("locality", e.target.value)
                    }}
                    onBlur={handleBlur}
                    error={errors.locality}
                    touched={touched.locality}
                />
                <StyledInput 
                    id="title"
                    label="Event Title"
                    type="text"
                    formClassName="col-md-6"
                    name="title"
                    value={values.title}
                    // placeholder="Enter Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.title}
                    touched={touched.title}
                />
            </div>

            <div className="row">
                <StyledInput 
                    id="description"
                    label="Event Description"
                    type="text"
                    formClassName="col-md-6"
                    name="description"
                    value={values.description}
                    // placeholder="Enter Latitude"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.description}
                    touched={touched.description}
                />
                <StyledInput 
                    id="location"
                    label="Location"
                    type="text"
                    formClassName="col-md-6"
                    name="location"
                    value={values.location}
                    // placeholder="Enter Longitude"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.location}
                    touched={touched.location}
                />
            </div>

            <div className="row">
                <StyledInput 
                    id="start_date_time"
                    label="Start Date"
                    type="datetime-local"
                    formClassName="col-md-6"
                    name="start_date_time"
                    value={values.start_date_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.start_date_time}
                    touched={touched.start_date_time}
                />
                <StyledInput 
                    id="end_date_time"
                    label="End Date"
                    type="datetime-local"
                    formClassName="col-md-6"
                    name="end_date_time"
                    value={values.end_date_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.end_date_time}
                    touched={touched.end_date_time}
                />
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." :"Save" }</button>
        </form>
	)
}

export default withPrivateRoute(FetchEventDetailsPage);