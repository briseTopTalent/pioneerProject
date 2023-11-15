import react from "react"
import Link from "next/link";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, string, ref, boolean } from "yup";

import withPrivateRoute from "components/wrapper/withPrivateRoute"
import DashboardLayout from "components/layout/dashboard/layout";
import StyledInput, { StyledSelect } from "components/form/StyledInput";
import { useAuth } from "services/apiService";
import { useRouter } from "next/router";
import { Pages, roleOptions } from "utils/constants";

const UserCreate = () => {
    const router = useRouter();
    const { createNewUser } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched } = useFormik({
		initialValues: {
            firstName: "",
            lastName: "",
			email: "",
			phoneNumber: "",
			password: "",
            role: "",
		},
		validationSchema: object().shape({
            firstName: string().required("First Name is required"),
            lastName: string().required("Last Name is required"),
			email: string().email("Invalid email address").required("Email is required"),
			phoneNumber: string().required("Phone Number is required"),
			password: string().min(8).required("Password is required"),
            role: string().required("Role is Required")
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await createNewUser(formData.firstName, formData.lastName, formData.email, String(formData.phoneNumber), formData.role, formData.password);
			if (isError) {
				setSubmitting(false);
				toast.error(error.message);
			} else {
				toast.success("success");
				return router.push(`/${Pages.USERS}`)
			}
		},
	});
    return(
        <DashboardLayout>
            <div className="hk-pg-header">
                <h4 className="hk-pg-title"><span className="pg-title-icon"><span className="feather-icon"><i data-feather="database"></i></span></span>Create New User</h4>
                <div className="d-flex">
                    <Link href={`/${Pages.USERS}`}><button className="btn btn-primary btn-sm">Cancel</button></Link>
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
                                            id="firstName"
                                            label="First Name"
                                            type="text"
                                            formClassName="col-md-6"
                                            name="firstName"
                                            value={values.firstName}
                                            placeholder="Enter First Name"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.firstName}
                                            touched={touched.firstName}
                                        />
                                        <StyledInput 
                                            id="lastName"
                                            label="Last Name"
                                            type="text"
                                            formClassName="col-md-6"
                                            name="lastName"
                                            value={values.lastName}
                                            placeholder="Enter Last Name"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.lastName}
                                            touched={touched.lastName}
                                        />
                                    </div>

                                    <div className="row">
                                        <StyledInput 
                                            id="email"
                                            label="Email"
                                            type="text"
                                            formClassName="col-md-6"
                                            name="email"
                                            value={values.email}
                                            placeholder="Enter Email Address"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.email}
                                            touched={touched.email}
                                        />
                                        <StyledInput 
                                            id="phoneNumber"
                                            label="Phone Number"
                                            type="number"
                                            formClassName="col-md-6"
                                            name="phoneNumber"
                                            value={values.phoneNumber}
                                            placeholder="Enter Phone Number"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.phoneNumber}
                                            touched={touched.phoneNumber}
                                        />
                                    </div>
                                    
                                    <div className="row">
                                        <StyledSelect 
                                            id="role"
                                            label="Role"
                                            formClassName="col-md-6"
                                            name="role"
                                            value={values.role}
                                            placeholder="Select Role"
                                            options={roleOptions}
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.role}
                                            touched={touched.role}
                                        />
                                        <StyledInput 
                                            id="password"
                                            label="Password"
                                            type="password"
                                            formClassName="col-md-6"
                                            name="password"
                                            value={values.password}
                                            placeholder="******"
											onChange={handleChange}
											onBlur={handleBlur}
                                            error={errors.password}
                                            touched={touched.password}
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

export default withPrivateRoute(UserCreate);