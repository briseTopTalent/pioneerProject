/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { object, string, ref, boolean } from "yup";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ApiClient, { axiosAPI } from "../../services/axiosClient";
import config from "../../config";
const axiosCall = config.PROXY_API ? axiosAPI : ApiClient;

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import PageLayout from "components/layout";
import withPublicRoute from "components/wrapper/withPublicRoute";
import { useAuth } from "services/apiService";
import { toast } from "react-toastify";

const LoginScreen = () => {
	const [isSubmitting, setSubmitting] = useState(false);
	const { loginCall,loginSso, } = useAuth();
	useEffect(async () => {
    if (window.location.href.match(/issue=1/g) && window.location.href.match(/\/auth\/login/g)) {
      setSubmitting(false);
      toast.error('Couldnt log you in. Please make sure you allow the app to read your email address')
      return
    }
    if (window.location.href.match(/login_now=1/g) && window.location.href.match(/\/auth\/login/g)) {
			const { isError, data, error } = await loginSso(window.location.href)
			if (isError) {
				setSubmitting(false);
				toast.error(error.message);
			} else {
				toast.success("Success. Logging you in now...");
        window.setTimeout(() => {
          return window.location.replace("/");
        },4000);
        return
			}
		}
	}, []);
  const forgotPassword = (e) => {
    e.preventDefault();
    window.location.href = '/auth/reset-password';
  };
	const sign_in = async () => {
		try {
			const response = await axiosCall.get(`/auth/google/sso/url`);
			if (response.status === 200) {
				const data = response.data.data;
				console.log(`okay. got 200 response`, response.data.data);
				window.location.href = response.data.data;
				return;
			}
		} catch (error) {
			console.error(`issue:`, error);
		}
	};

	const { values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue } =
		useFormik({
			initialValues: {
				email: "",
				password: "",
				checked: true,
			},
			validationSchema: object().shape({
				email: string().email("Invalid email address").required("Field is required"),
				password: string().required("Password is required"),
				checked: boolean().default(true),
			}),
			onSubmit: async (formData) => {
				setSubmitting(true);
				const { isError, data, error } = await loginCall(formData.email, formData.password);
				if (isError) {
          if(String(error.message).toLowerCase() === 'permission denied'){
            window.location.href= 'https://nycfirewire.net/app';
            return;
          }
					setSubmitting(false);
					toast.error(error.message);
				} else {
					toast.success("success");
					return window.location.replace("/");
				}
			},
		});

	const setCValue = (v) => setFieldValue("checked", v);

	return (
		<PageLayout>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-12 pa-0">
						<div className="auth-form-wrap pt-xl-0 pt-70">
							<div className="auth-form w-xl-30 w-lg-55 w-sm-75 w-100">
								<form onSubmit={handleSubmit}>
									<h1 className="display-4 text-center mb-10">Welcome Back :)</h1>
									<p className="text-center mb-30">Sign in to your account.</p>
									<div className="form-group">
										<input
											className="form-control"
											placeholder="Email"
											type="email"
											name="email"
											onChange={handleChange}
											value={values.email}
											onBlur={handleBlur}
										/>
										{touched.email && errors.email && (
											<p className="font-14 mt-15 text-danger">
												{" "}
												* {errors.email}
											</p>
										)}
									</div>
									<div className="form-group">
										<div className="input-group">
											<input
												className="form-control"
												placeholder="Password"
												type="password"
												name="password"
												onChange={handleChange}
												value={values.password}
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
									<div className="custom-control custom-checkbox mb-25">
										<input
											className="custom-control-input"
											id="same-address"
											type="checkbox"
											onChange={(e) => setCValue(e.target.checked)}
											value={values.checked}
											onBlur={handleBlur}
											checked={values.checked}
										/>
										<label
											className="custom-control-label font-14"
											htmlFor="same-address"
										>
											Keep me logged in
										</label>
									</div>
									<button
										onClick={handleSubmit}
										className="btn btn-primary btn-block"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Logging you in..." : "Login"}
									</button>
                  <button
                    onClick={forgotPassword}
										className="btn btn-secondary btn-block"
                  >
                    Forgot password?
                  </button>
                    
									{/* <p className="font-14 text-center mt-15">Having trouble logging in?</p> */}
								</form>
								<div className="google-sso-wrapper">
									<a href="javascript:void(0);" onClick={sign_in}>
										<img src="/img/google.png" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default withPublicRoute(LoginScreen, true);
