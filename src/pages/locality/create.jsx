import react from "react"
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

const roleOptions = [
    { label: "Super Admin", value: "super"},
    { label: "Admin", value: "admin"},
    { label: "Sub Admin", value: "sub_admin"}
];

const LocalityCreate = () => {
    const router = useRouter();
    const { createNewLocality } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched } = useFormik({
		initialValues: {
            name: "",
            state: "",
			longitude: "",
			latitude: "",
		},
		validationSchema: object().shape({
            name: string().required("Name is required"),
            state: string().required("State is required"),
			longitude: number().required("Longitude is required"),
			latitude: number().required("Latitude is required"),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await createNewLocality(formData.name, formData.state, String(formData.longitude), String(formData.latitude));
			if (isError) {
				setSubmitting(false);
				toast.error(error.message);
			} else {
				toast.success("success");
				return router.push(`/${Pages.LOCALITY}`)
			}
		},
	});
    return(
        <DashboardLayout pageTitle={"create Locality"}>
            <div className="hk-pg-header">
                <h4 className="hk-pg-title"><span className="pg-title-icon"><span className="feather-icon"><i data-feather="database"></i></span></span>Create New Locality</h4>
                <div className="d-flex">
                    <Link href={`/${Pages.LOCALITY}`}><button className="btn btn-primary btn-sm">Cancel</button></Link>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <section className="hk-sec-wrapper">
                        <div className="row">
                            <div className="col-sm">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <StyledInput 
                                            id="Name"
                                            label="Name"
                                            type="text"
                                            formClassName="col-md-6"
                                            name="name"
                                            value={values.name}
                                            placeholder="Enter Name"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.name}
                                            touched={touched.name}
                                        />
                                        <StyledInput 
                                            id="state"
                                            label="State"
                                            type="text"
                                            formClassName="col-md-6"
                                            name="state"
                                            value={values.state}
                                            placeholder="Enter State"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.state}
                                            touched={touched.state}
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

export default withPrivateRoute(LocalityCreate);