/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState } from "react";
import { useFormik } from "formik";
import { object, string, ref, boolean } from "yup";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import PageLayout from "components/layout";
import withPublicRoute from "components/wrapper/withPublicRoute";
import { useAuth } from "services/apiService";
import { toast } from "react-toastify";

const ForgotPassword = () => {
	const [isSubmitting, setSubmitting] = useState(false);
	const { resetPassword } = useAuth();
	function getJsonFromUrl() {
		const u = new URLSearchParams(location.search);
		let result = {};
		for (const k of u.keys()) {
			result[k] = u.get(k);
		}
		return result;
	}

	const resetHash = () => {
		const params = getJsonFromUrl();
		return params?.h;
	};

	const { values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue } =
		useFormik({
			initialValues: {
				password: "",
			},
			validationSchema: object().shape({
				password: string().required("Password is required"),
				confirmPassword: string().required("Confirm Password is required"),
			}),
			onSubmit: async (formData) => {
				if (formData.password !== formData.confirmPassword) {
					toast.error("Passwords do not match");
					return false;
				}
				setSubmitting(true);
				const { isError, data, error } = await resetPassword(
					resetHash(),
					formData.password,
					formData.confirmPassword
				);
				if (isError) {
					setSubmitting(false);
					toast.error(error.message);
				} else {
					toast.success("success! Redirecting you back to the login screen");
					window.setTimeout(() => {
						window.location.href = "/auth/login";
					}, 5000);
				}
			},
		});

	return (
		<PageLayout>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-12 pa-0">
						<div className="auth-form-wrap pt-xl-0 pt-70">
							<div className="auth-form w-xl-30 w-lg-55 w-sm-75 w-100">
								<form onSubmit={handleSubmit}>
									<h1 className="display-4 text-center mb-10">
										Reset your password
									</h1>
									<p className="text-center mb-30">Please enter a new password</p>
									<div className="form-group">
										<div className="input-group">
											<input
												className="form-control"
												placeholder="Password"
												type="password"
												name="password"
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<div className="input-group-append">
												<span className="input-group-text">
													<span className="feather-icon">
														<i data-feather="eye-off" />
													</span>
												</span>
											</div>
										</div>
										<div className="input-group">
											<input
												className="form-control"
												placeholder="Confirm Password"
												type="password"
												name="confirmPassword"
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<div className="input-group-append">
												<span className="input-group-text">
													<span className="feather-icon">
														<i data-feather="eye-off" />
													</span>
												</span>
											</div>
										</div>
										{touched.password && errors.password && (
											<p className="font-14 mt-15 text-danger">
												{" "}
												* {errors.password}
											</p>
										)}
									</div>
									<button
										onClick={handleSubmit}
										className="btn btn-primary btn-block"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Resetting..." : "Reset"}
									</button>
									{/* <p className="font-14 text-center mt-15">Having trouble logging in?</p> */}
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default withPublicRoute(ForgotPassword, true);
