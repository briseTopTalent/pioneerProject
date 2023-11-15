import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Loader, MapPin } from "react-feather";
import { toast } from "react-toastify";
import moment from "styles/vendors/moment/moment";
import config from "config";

import DashboardLayout from "components/layout/dashboard/layout";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import Pagination from "components/pagination";
import { useAuth } from "services/apiService";
// import { constants } from "utils";
import { adminRoles, Pages } from "utils/constants";
import Button from "components/button";
import Script from "next/script";

const LocalityPage = () => {
	const { fetchLocalities, currentUser } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [data, setDatas] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const isSuperAdmin = currentUser?.isAdmin;
	console.log(currentUser, isSuperAdmin);

	useEffect(async () => {
		await FetchData();
	}, []);

	const FetchData = async () => {
		const { isError, data, error } = await fetchLocalities(page, limit);
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

	return (
		<DashboardLayout pageTitle={"Locality"}>
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<MapPin />
					</span>
					Localities
				</h4>
				<div className="d-flex">
					<Link href={`/${Pages.LOCALITY}/create`}>
						<button className="btn btn-primary btn-sm">Create New Locality</button>
					</Link>
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
												<th></th>
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
													<tr key={i} onClick={() => routePage(u.email)}>
														<td>{u?.id}</td>
														<td>{u?.name}</td>
														<td>{u?.state}</td>
														<td>{u?.latitude || "-"}</td>
														<td>{u?.longitude || "-"}</td>
														<td>{u?.news_url || "-"}</td>
														<td>
															<div className="mb-2 button-list">
																<Button
																	label="View"
																	variant="info"
																	onClick={() => routePage(u?.id)}
																/>
																{isSuperAdmin && (
																	<Button
																		label="View Admins"
																		variant="info"
																		onClick={() =>
																			routePage(
																				u?.id,
																				"admins"
																			)
																		}
																	/>
																)}
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
				</div>
			</div>
			<Script
				src={`https://maps.googleapis.com/maps/api/js?key=${config.MAP_API}&libraries=places`}
			/>
		</DashboardLayout>
	);
};
export default withPrivateRoute(LocalityPage);
