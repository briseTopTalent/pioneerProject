import React, { useEffect, useState} from "react"
import Link from "next/link";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, number, string, ref, boolean } from "yup";

import withPrivateRoute from "components/wrapper/withPrivateRoute"
import DashboardLayout from "components/layout/dashboard/layout";
import StyledInput, { StyledSelect } from "components/form/StyledInput";
import { useAuth } from "services/apiService";
import { useRouter } from "next/router";
import { Pages } from "utils/constants";
import { MapPin } from "react-feather";

const CreateEventPage = () => {
    const router = useRouter();
    const { createEvent, fetchAdminLocality, fetchLocalityDefinitions, currentUser } = useAuth();
    const [locality, setLocality] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);

    const fetchUserLocality = async () => {
        const { isError, data, error } = await fetchAdminLocality(currentUser.email);
        if (isError) toast.error(error.message);
        const l = data.data.map((t)=>{
            return { label: t.name, value: t.id }
        })
        setLocality(l)
    }
	const { values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, setSubmitting, errors, touched } = useFormik({
		initialValues: {
            locality: "",
            title: "",
			description: "",
			location: "",
			start_date_time: "",
			end_date_time: "",
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
			const { isError, data, error } = await createEvent(formData);
            console.log(isError, data, error)
			if (isError) {
				toast.error(error.message);
			} else {
				toast.success("success");
				return router.push(`/${Pages.EVENT}`)
			}
			// setSubmitting(false);
		},
	});

    useEffect(async()=>{
        await fetchUserLocality()
    },[])
    return(
        <DashboardLayout pageTitle={"Create Incident"}>
            <div className="hk-pg-header">
                <h4 className="hk-pg-title"><span className="pg-title-icon"><MapPin/></span>Create Event</h4>
                <div className="d-flex">
                    <Link href={`/${Pages.EVENT}`}><button className="btn btn-primary btn-sm">Cancel</button></Link>
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

                                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." :"Create" }</button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default withPrivateRoute(CreateEventPage);