import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, string, ref, boolean } from "yup";
import Button from "components/button";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import moment from "styles/vendors/moment/moment";
import { constants } from "utils";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages, SuperPermissions } from "utils/constants";
import { Loader } from "react-feather";
import Pagination from "components/pagination";
import CustomModal from "components/modal";
import StyledInput from "components/form/StyledInput";
const perms = SuperPermissions;
const UserDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const { fetchUserById, currentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState({});
	const [showEdit, setShowEdit] = useState(false);

	const FetchUser = async () => {
		// if (id){
		const { isError, data, error } = await fetchUserById(id);
		if (isError) {
			console.log(error, id);
			toast.error(error.data.message);
			router.push(`/${Pages.USERS}`, {
				message: "User not Found",
			});
		} else {
			setUserData(data);
			console.log(data);
		}
		setIsLoading(false);
		// }
	};

	useEffect(() => FetchUser(), [id, showEdit]);
	return (
		<DashboardLayout pageTitle={id}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title">
						<span className="pg-title-icon">
							<span className="feather-icon">
								<i data-feather="book"></i>
							</span>
						</span>
						User Details
					</h4>
				</div>
				<div className="d-flex">
					{perms.includes(currentUser?.role) && (
						<button
							onClick={() => setShowEdit(true)}
							className="btn btn-primary btn-sm"
						>
							Edit
						</button>
					)}
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>First Name</span>
						<h3>{userData?.first_name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Last Name</span>
						<h3>{userData?.last_name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Email</span>
						<h3>{userData?.email || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Phone Number</span>
						<h3>{userData?.phone_number || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Status</span>
						<h3>{userData?.veri || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>last Login</span>
						<h3>
							{(userData?.last_login &&
								moment(userData?.last_login).format(constants.DATE_FOMAT)) ||
								"-"}
						</h3>
					</div>
				</div>
			</section>
			<hr style={{ margin: "2em" }} />
			{!isLoading && userData?.id && <UserLocality id={userData?.id} />}
			{!isLoading && showEdit && (
				<CustomModal
					centered={true}
					component={
						<EditUserForm data={userData} closeModal={() => setShowEdit(false)} />
					}
					show={showEdit}
					title={"Edit User"}
					closeModal={() => setShowEdit(false)}
				/>
			)}
		</DashboardLayout>
	);
};

const UserLocality = ({ id }) => {
	const { fetchUserLocalities } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit, setLimit] = useState(10);

	console.debug({ id });
	useEffect(() => {
		FetchData();
	}, [id]);

	const FetchData = async () => {
		const obj = await fetchUserLocalities(id, page, limit);
		const isError = obj.isError;
		console.debug({ obj });
		const d = obj.data ?? [];
		const error = obj.error ?? null;
		if (isError) toast.error(error.message);
		console.debug({ d });
		setData(d);
		setPages(1); // FIXME
		setLoading(false);
	};

	const routePage = (id, m) => {
		if (id) return router.push(`/${Pages.LOCALITY}/${id}${m ? "/" + m : ""}`);
	};
	const pageNavigate = (page) => setPage(page);

	return (
		<>
			<div className="hk-pg-header mb-10">
				<div>
					<h5 className="hk-pg-title">
						<span className="pg-title-icon">
							<span className="feather-icon">
								<i data-feather="book"></i>
							</span>
						</span>
						Followed Localities
					</h5>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body pa-0">
							<div className="table-wrap">
								<div className="table-responsive">
									<table className="table table-sm table-hover mb-0">
										<thead>
											<tr>
												<th>Locality ID</th>
												<th>Name</th>
												<th>State</th>
												<th>Latitude</th>
												<th>Longitude</th>
												<th>News Url</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{!loading &&
												data.map((u, i) => (
													<tr key={i} onClick={() => routePage(u.id)}>
														<td>{u.id}</td>
														<td>{u.name}</td>
														<td>{u.state}</td>
														<td>{u.latitude || "-"}</td>
														<td>{u.longitude || "-"}</td>
														<td>{u.news_url || "-"}</td>
														<td>
															<div className="button-list">
																<Button
																	label="View"
																	variant="info"
																	onClick={() => routePage(u?.id)}
																/>
																{/* <Button label="View Admins" variant="info" onClick={()=>routePage(u?.id, "admins")} /> */}
															</div>
														</td>
													</tr>
												))}
											{loading && (
												<tr>
													<td className="text-center" colSpan={10}>
														<Loader />
														<p>Loading...</p>
													</td>
												</tr>
											)}
											{!loading && (!data || data.length == 0) && (
												<tr>
													<td className="text-center" colSpan={10}>
														No data
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<Pagination currentPage={page} clickAction={pageNavigate} totalPages={pages} />
				</div>
			</div>
		</>
	);
};

const EditUserForm = ({ data, closeModal }) => {
	const fD = data;
	const { updateUserData } = useAuth();
	const {
		values,
		handleChange,
		handleBlur,
		handleSubmit,
		isSubmitting,
		setSubmitting,
		errors,
		touched,
		setFieldValue,
	} = useFormik({
		initialValues: {
			firstName: data?.first_name || "",
			lastName: data?.last_name || "",
			phoneNumber: data?.phone_number || "",
			// role: "",
		},
		validationSchema: object().shape({
			firstName: string().required("First Name is required"),
			lastName: string().required("Last Name is required"),
			phoneNumber: string().required("Phone Number is required"),
			// role: string().required("Role is Required")
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await updateUserData(fD.id, formData);
			setSubmitting(false);
			if (isError) toast.error(error.message);
			else {
				toast.success("success");
				closeModal();
			}
		},
	});
	console.log(values);
	return (
		<form onSubmit={handleSubmit}>
			{/* <div className="row"> */}
			<StyledInput
				id="FirstName"
				label="First Name"
				type="text"
				name="firstName"
				// formClassName="col-md-6"
				value={values.firstName}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors.firstName}
				touched={touched.firstName}
			/>
			<StyledInput
				id="lastName"
				label="lastName"
				type="text"
				name="lastName"
				// formClassName="col-md-6"
				value={values.lastName}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors.lastName}
				touched={touched.lastName}
			/>
			<StyledInput
				id="phoneNumber"
				label="phoneNumber"
				type="text"
				name="phoneNumber"
				// formClassName="col-md-6"
				value={values.phoneNumber}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors.phoneNumber}
				touched={touched.phoneNumber}
			/>
			{/* </div> */}

			<button className="btn btn-primary" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Saving..." : "Save"}
			</button>
		</form>
	);
};

export default withPrivateRoute(UserDetailsPage);
