import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Calendar, Loader, MapPin } from "react-feather";
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

const EventPage = () => {
	const { fetchEvents, fetchAdminLocality, currentUser } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [data, setDatas] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [locality, setLocality] = useState([]);
	const [showEdit, setShowEdit] = useState(false);
	const [component, setComponent] = useState(null);

	useEffect(async () => {
		await fetchUserLocality();
		await FetchData();
	}, []);

	const fetchUserLocality = async () => {
		const { isError, data, error } = await fetchAdminLocality(currentUser.email);
		console.log(data, error);
		if (isError) toast.error(error.message);
		const l = data.data.map((t) => {
			return { label: t.name, value: t.id };
		});
		setLocality(l);
	};

	const FetchData = async (l = null) => {
		const { isError, data, error } = await fetchEvents(l, page, limit);
		if (isError) toast.error(error.message);
		setDatas(data.data);
		setPages(data.pages);
		setLoading(false);
	};

	const routePage = (id, m) => {
		console.log(id);
		if (id) return router.push(`/${Pages.LOCALITY}/${id}${m ? "/" + m : ""}`);
	};
	const pageNavigate = (page) => setPage(page);
	const fetchByLocality = async (l) => {
		setLoading(true);
		await FetchData(l);
	};

	const SetModalView = (t, c) => {
		setComponent(c);
		setShowEdit(t);
	};

	return (
		<DashboardLayout pageTitle={"Locality"}>
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<Calendar />
					</span>
					Calendar Events
				</h4>
				<div className="d-flex">
					<Link href={`/${Pages.EVENT}/create`}>
						<button className="btn btn-primary btn-sm">Create Event</button>
					</Link>
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
								onChange={(e) => fetchByLocality(e.target.value)}
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
												<th>Title</th>
												<th>Description</th>
												{/* <th>Location</th> */}
												<th>Start Date</th>
												<th>End Date</th>
												{/* <th>Created On</th> */}
												<th></th>
											</tr>
										</thead>
										<tbody>
											{!loading &&
												data.map((u, i) => (
													<tr key={i}>
														<td>{i + 1}</td>
														<td>{u?.localityData?.name}</td>
														<td>{u?.title}</td>
														<td>{u?.description.slice(0, 10)}...</td>
														{/* <td>{u?.location || "-"}</td> */}
														<td>
															{u?.start_date_time != null
																? moment(u?.start_date_time).format(
																		constants.DATE_FOMAT
																  )
																: "-"}
														</td>
														<td>
															{u?.end_date_time != null
																? moment(u?.end_date_time).format(
																		constants.DATE_FOMAT
																  )
																: "-"}
														</td>
														{/* <td>{moment(u?.created_at).format(constants.DATE_FOMAT) || "-"}</td> */}
														<td>
															<Button
																label="View"
																variant="info"
																onClick={() =>
																	router.push(
																		`/${Pages.EVENT}/${u.id}`
																	)
																}
															/>
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
											{!loading && data.length == 0 && (
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
					{showEdit && (
						<CustomModal
							component={component}
							show={showEdit}
							title={"Edit Locality"}
							closeModal={() => SetModalView(false, null)}
						/>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
};

export default withPrivateRoute(EventPage);
