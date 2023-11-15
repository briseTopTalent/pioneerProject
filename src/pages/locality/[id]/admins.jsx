import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, number, string, boolean } from "yup";
import { Loader } from "react-feather";
import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import Pagination from "components/pagination";
import { useAuth } from "services/apiService";
import { constants } from "utils";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages, roleOptions } from "utils/constants";
import CustomModal from "components/modal";
import StyledInput, { StyledSelect } from "components/form/StyledInput";
import Button from "components/button";
import ConfirmModal from "components/modal/confirmModal";

const LocalityAdminPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const { fetchLocalityUsers, removeAdmintoLocality, currentUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [showModal, setShowModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [currentDeleteEmail, setCurrentDeleteEmail] = useState(null);
	useEffect(async () => {
		await FetchData();
	}, [id]);

	const FetchData = async () => {
		if (!currentUser?.isAdmin) {
			return router.push(`/locality`);
		}
		const { isError, data, error } = await fetchLocalityUsers(id, page, limit);
		if (isError) toast.error(error.message);
		// console.log("dd-->", data);
		setUsers(data.data);
		setPages(data.pages);
		setLoading(false);
	};

	const routePage = (id) => {
		return router.push(`/${Pages.USERS}/${id}`);
	};

	const pageNavigate = (page) => {
		setLoading(true);
		setPage(page);
		fetchLocalityUsers(id, page, limit)
			.then(({ isError, data, error }) => {
				if (isError) toast.error(error.message);
				if (data?.data) {
					setUsers(data.data);
					setPages(data.pages);
				}
				setLoading(false);
			})
			.catch((error) => {
				alert(error);
				setLoading(false);
			});
	};
	const startDeleteModal = (email) => {
		setCurrentDeleteEmail(email);
		setConfirmModal(true);
	};
	const RemoveAdmin = async (email) => {
		setConfirming(true);
		const { isError, data, error } = await removeAdmintoLocality(id, email);
		if (isError) toast.error(error.message);
		else toast.success("success");
		setConfirming(false);
		setConfirmModal(false);
		await FetchData();
	};

	return (
		<DashboardLayout pageTitle={"Users"}>
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<span className="feather-icon">
							<i data-feather="database"></i>
						</span>
					</span>
					Sub Admins
				</h4>
				<div className="d-flex">
					<button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
						Add Admin To Locality
					</button>
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
												<th>User ID</th>
												<th>First Name</th>
												<th>Last Name</th>
												<th>Email</th>
												<th>Last Login</th>
												<th>Registration Date</th>
												<th>Status</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{!loading &&
												users.map((u, i) => (
													<tr key={i}>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u?.id}
														</td>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u?.first_name}
														</td>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u?.last_name}
														</td>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u.email}
														</td>
														<td>
															{u?.last_login
																? moment(u?.last_login).format(
																		constants.DATE_FOMAT
																  )
																: "-"}
														</td>
														<td>
															{moment(u?.created_at).format(
																constants.DATE_FOMAT
															)}
														</td>
														<td>
															{u?.verfied
																? "verified"
																: u?.flagged
																? "flagged"
																: "unverified"}
														</td>
														<td>
															<button
																onClick={() => {
																	event.preventDefault();
																	startDeleteModal(u.email);
																}}
																className="btn btn-icon btn-icon-circle btn-danger btn-icon-style-3"
															>
																<span className="btn-icon-wrap">
																	<i className="fa fa-trash"></i>
																</span>
															</button>
														</td>

														{confirmModal && (
															<ConfirmModal
																loading={confirming}
																show={confirmModal}
																closeModal={() =>
																	setConfirmModal(false)
																}
																nextAction={() => {
																	RemoveAdmin(currentDeleteEmail);
																}}
															/>
														)}
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
											{!loading && users.length == 0 && (
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
			{showModal && (
				<CustomModal
					centered={true}
					component={<AddSubAdmin data={{ id }} closeModal={() => setShowModal(false)} />}
					show={showModal}
					title={"Add Sub Admin"}
					closeModal={() => setShowModal(false)}
				/>
			)}
		</DashboardLayout>
	);
};

const AddSubAdmin = ({ data }) => {
	const fD = data;
	const { addAdmintoLocality } = useAuth();
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
			email: data?.email || "",
			role: data?.role || "sub_admin",
		},
		validationSchema: object().shape({
			email: string().required("Email is Required"),
			role: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			const { isError, data, error } = await addAdmintoLocality(fD.id, formData);
			if (isError) {
				setSubmitting(false);
				toast.error(error.message);
			} else {
				toast.success("success");
				closeModal();
			}
		},
	});
	return (
		<form onSubmit={handleSubmit}>
			{/* <div className="row"> */}
			<StyledInput
				id="Email"
				label="Email"
				type="email"
				name="email"
				// formClassName="col-md-"
				value={values.email}
				onChange={handleChange}
				onBlur={handleBlur}
				error={errors.email}
				touched={touched.email}
			/>
			{/* <StyledSelect 
                    id="role"
                    label="Role"
                    // formClassName="col-md-6"
                    name="role"
                    value={values.role}
                    placeholder="Select Role"
                    options={roleOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.role}
                    touched={touched.role}
                /> */}
			{/* </div> */}
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add Admin"}
			</button>
		</form>
	);
};

export default withPrivateRoute(LocalityAdminPage);
