import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import CountCard from "components/dashboard/countCard";
import { useAuth } from "services/apiService";
import { Pages } from "utils/constants";

const Home = () => {
	const { fetchUserCount, fetchLocalityCount, fetchIncidentCount, fetchUsers } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState([]);
	const [userCount, setUserCount] = useState(0);
	const [localityCount, setLocalities] = useState(0);
	const [incidentCount, setIncidents] = useState(0);
	const [initialized, setInitialized] = useState(false);
	useEffect(() => {
		if (!initialized) {
			fetchUsers(1, 10, setUsers, null);
			fetchUserCount(setUserCount);
			fetchLocalityCount(setLocalities);
			fetchIncidentCount(setIncidents);
			setInitialized(true);
		}
	});

	const routePage = (id) => {
		return router.push(`/${Pages.USERS}/${id}`);
	};
	return (
		<DashboardLayout pageTitle={"Dashboard"}>
			<div className="hk-pg-header align-items-top">
				<div>
					<h2 className="hk-pg-title font-weight-600 mb-10">Dashboard</h2>
					<p>Welcome.</p>
				</div>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<div className="hk-row">
						<CountCard title={"Users"} value={userCount} />
						<CountCard title={"Localities"} value={localityCount} />
						<CountCard title={"Incidents"} value={incidentCount} />
					</div>

					<div className="d-flex align-items-center justify-content-between mt-40 mb-20">
						<h4>Recent Users</h4>
						<Link href="/users" className="btn btn-sm btn-link">
							view all
						</Link>
					</div>

					<div className="card">
						<div className="card-body pa-0">
							<div className="table-wrap">
								<div className="table-responsive">
									<table className="table table-sm table-hover mb-0">
										<thead>
											<tr>
												<th>First Name</th>
												<th>Last Name</th>
												<th>Email</th>
												<th>Phone Number</th>
												<th>Last Login</th>
												<th>Registration Date</th>
												<th>Status</th>
												{/* <th></th> */}
											</tr>
										</thead>
										<tbody>
											{users.map((u, i) => (
												<tr key={i} onClick={() => routePage(u.email)}>
													<td>{u?.first_name}</td>
													<td>{u?.last_name}</td>
													<td>{u?.email}</td>
													<td>{u?.phone_number || "-"}</td>
													<td>
														{u?.last_login
															? moment(u?.last_login).format(
																	"dd, MMM YYYY hh:ss"
															  )
															: "-"}
													</td>
													<td>
														{moment(u?.created_at).format(
															"dd, MMM YYYY hh:ss"
														)}
													</td>
													<td>
														{u?.verfied
															? "verified"
															: u?.flagged
															? "flagged"
															: "-"}
													</td>
													{/* <td><Button label="View" variant="info" onClick={()=>routePage(u.email)} /></td> */}
												</tr>
											))}
											{users.length == 0 && (
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
				</div>
			</div>
		</DashboardLayout>
	);
};

export default withPrivateRoute(Home);
