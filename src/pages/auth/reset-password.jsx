/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { object, string, ref, boolean } from "yup";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import PageLayout from "components/layout";
import withPublicRoute from "components/wrapper/withPublicRoute";
import { useAuth } from "services/apiService";
import { toast } from "react-toastify";

const ResetPassword = () => {
	const [isSubmitting, setSubmitting] = useState(false);
	const { forgotPassword } = useAuth();
	const [email, setEmail] = useState(null);

	function getJsonFromUrl(url) {
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
	const trim = (s) => {
		if (!s) {
			return "";
		}
		return String(s)
			.replace(/^[\s]+/, "")
			.replace(/[\s]+$/, "");
	};
	function stripHtml(html) {
		let tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}
	const { values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue } =
		useFormik({
			initialValues: {
				email: '',
			},
			validationSchema: object().shape({
				email: string().required("Email is required"),
			}),
			onSubmit: async (formData) => {
				if (trim(formData.email).length === 0) {
					toast.error("Email is required");
					return false;
				}
				setSubmitting(true);
				const { isError, data, error } = await forgotPassword(
					trim(formData.email)
				);
				if (isError) {
					setSubmitting(false);
					toast.error(error.message);
				} else {
          setSubmitting(false);
          console.debug({data,error});
					toast.success(data.data.message);
				}
			},
		});
	useEffect(() => {
    console.debug({useEffect: new Date()});
		let params = new URLSearchParams(window.location.search);
		if (params && params.get("email")) {
			let email = stripHtml(params.get("email")).replace(/['\"]/g, '');
        setFieldValue("email",email);
		}
	}, []);


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
									<p className="text-center mb-30">Please enter your email</p>
									<div className="form-group">
										<div className="input-group">
											<input
												className="form-control"
												placeholder="email"
												type="text"
												name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
											/>
										</div>
										{touched.email && errors.email && (
											<p className="font-14 mt-15 text-danger">
												{" "}
												* {errors.email}
											</p>
										)}
									</div>
									<button
										onClick={handleSubmit}
										className="btn btn-primary btn-block"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Submitting..." : "Submit"}
									</button>
                  <br/><br/>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default withPublicRoute(ResetPassword, true);
