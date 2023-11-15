import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Loader, Users } from "react-feather";
import { toast } from "react-toastify";
import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import Pagination from "components/pagination";
import { useAuth } from "services/apiService";
import { constants } from "utils";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages, SuperPermissions } from "utils/constants";
const perms = SuperPermissions;
const UsersPage = () => {
	const { fetchUsers, currentUser, searchUsers } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [pageInitialized, setPageInitialized] = useState(false);

	useEffect(async () => {
		await FetchData();
	}, []);

	const clickSearch = async () => {
		setLoading(true);
		let fname, lname, email;
		fname = document.getElementById("search_fname").value;
		lname = document.getElementById("search_lname").value;
		email = document.getElementById("search_email").value;
		const { isError, data, error } = await searchUsers(fname, lname, email);
		console.debug({ isError, data, error });
		if (isError) {
			toast.error(error.message);
			return;
		}
		console.log("search-->", data);
		if (data?.data) {
			if (!Array.isArray(data.data)) {
				setUsers([data.data]);
			} else {
				setUsers(data.data);
			}
			setPages(1);
		} else {
			setUsers([]);
		}
		setLoading(false);
	};

	const FetchData = async () => {
		if (pageInitialized) {
			return;
		}
		const { isError, data, error } = await fetchUsers(page, limit);
		if (isError) toast.error(error.message);
		console.log("dd-->", data);
		if (data?.data) {
			setUsers(data.data);
			setPages(data.pages);
		}
		setLoading(false);
		setPageInitialized(true);
	};

	const routePage = (id) => {
		return router.push(`/${Pages.USERS}/${id}`);
	};
	const pageNavigate = (page) => {
		setLoading(true);
		setPage(page);
		fetchUsers(page, limit)
			.then(({ isError, data, error }) => {
				if (isError) toast.error(error.message);
				console.log("dd-->", data);
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

	return (
		<DashboardLayout pageTitle="Users">
			<div className="hk-pg-header">
				<h4 className="hk-pg-title">
					<span className="pg-title-icon">
						<Users />
					</span>
					Users
				</h4>
				<div className="d-flex">
					{perms.includes(currentUser?.role) && (
						<Link href={`/${Pages.USERS}/create`}>
							<button className="btn btn-primary btn-sm">Create New User</button>
						</Link>
					)}
				</div>
			</div>
			<div className="hk-pg-header">
				<div>
					First name: <input type="text" id="search_fname" />
					<br />
					Last name: <input type="text" id="search_lname" />
					<br />
					Email: <input type="text" id="search_email" />
					<br />
					<button className="btn" onClick={() => clickSearch()}>
						Search
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
												<th></th>
												<th>First Name</th>
												<th>Last Name</th>
												<th>Email</th>
												{/* <th>Phone Number</th> */}
												<th>Last Login</th>
												<th>Registration Date</th>
												<th>Status</th>
												{/* <th></th> */}
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
															{u.id}
														</td>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u.first_name}
														</td>
														<td
															onClick={() => {
																console.debug("routePage");
																routePage(u.email);
															}}
														>
															{u.last_name}
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
														{/* <td><Button label="View" variant="info" onClick={()=>routePage(u.email)} /></td> */}
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
		</DashboardLayout>
	);
};
export default withPrivateRoute(UsersPage);
