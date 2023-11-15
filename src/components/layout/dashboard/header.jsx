import React, { useState } from "react";
import { Bell, Gear, Menu, Search, Settings } from "react-feather";

import { useAuth } from "services/apiService";

const DashboardHeader = ({ toggleSidebar }) => {
	const { currentUser, logoutUser } = useAuth();
	const [showProfile, setShowProfile] = useState(false);
	const HandleProfileDropDown = () => setShowProfile(!showProfile);
	
	return (
		<>
			<nav className="navbar navbar-expand-xl navbar-dark fixed-top hk-navbar">
				<a id="navbar_toggle_btn" className="navbar-toggle-btn nav-link-hover" onClick={toggleSidebar}>
					<span className="feather-icon">
						<Menu />
					</span>
				</a>
				<a className="navbar-brand" href="dashboard1.html">
					FireWire
				</a>
				<ul className="navbar-nav hk-navbar-content">
					<li className="nav-item dropdown dropdown-notifications">
						<a
							className="nav-link dropdown-toggle no-caret"
							href="#"
							role="button"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<span className="feather-icon">
								<i data-feather="bell" />
								<Bell />
							</span>
							{/* <span className="badge-wrap"><span className="badge badge-primary badge-indicator badge-indicator-sm badge-pill pulse"></span></span> */}
						</a>
						<div
							className="dropdown-menu dropdown-menu-right"
							data-dropdown-in="fadeIn"
							data-dropdown-out="fadeOut"
						>
							<h6 className="dropdown-header">
								Notifications{" "}
								<a href="#" className="">
									View all
								</a>
							</h6>
							<div className="notifications-nicescroll-bar">
								<a href="#" className="dropdown-item">
									<div className="media">
										<div className="media-img-wrap">
											<div className="avatar avatar-sm">
												<span className="avatar-text avatar-text-warning rounded-circle">
													<span className="initial-wrap">
														<span>
															<i className="zmdi zmdi-notifications font-18" />
														</span>
													</span>
												</span>
											</div>
										</div>
										<div className="media-body">
											<div>
												<div className="notifications-text">
													Last 2 days left for the project
												</div>
												<div className="notifications-time">15d</div>
											</div>
										</div>
									</div>
								</a>
							</div>
						</div>
					</li>
					<li
						className={`nav-item dropdown dropdown-authentication ${
							showProfile ? "show" : ""
						}`}
					>
						<a
							className="nav-link dropdown-toggle no-caret"
							href="#"
							role="button"
							aria-haspopup="true"
							aria-expanded="false"
							onClick={HandleProfileDropDown}
						>
							<div className="media">
								<div className="media-img-wrap">
									<div className="avatar">
										<img
											src="/img/avatar12.jpg"
											alt="user"
											className="avatar-img rounded-circle"
										/>
									</div>
									<span className="badge badge-success badge-indicator" />
								</div>
								<div className="media-body">
									<span>
										{currentUser?.first_name +" "+ currentUser?.last_name}
										<i className="zmdi zmdi-chevron-down" />
									</span>
								</div>
							</div>
						</a>
						<div
							className={`dropdown-menu dropdown-menu-right ${
								showProfile ? "show" : ""
							}`}
							data-dropdown-in="flipInX"
							data-dropdown-out="flipOutX"
						>
							{/* <a className="dropdown-item" href="profile.html">
								<i className="dropdown-icon zmdi zmdi-account" />
								<span>Profile</span>
							</a> */}
							<a className="dropdown-item" href="#">
								<i className="dropdown-icon zmdi zmdi-settings" />
								<span>Settings</span>
							</a>
							<div className="dropdown-divider" />
							{/* <div className="sub-dropdown-menu show-on-hover">
								<a href="#" className="dropdown-toggle dropdown-item no-caret">
									<i className="zmdi zmdi-check text-success" />
									Online
								</a>
								<div className="dropdown-menu open-left-side">
									<a className="dropdown-item" href="#">
										<i className="dropdown-icon zmdi zmdi-check text-success" />
										<span>Online</span>
									</a>
									<a className="dropdown-item" href="#">
										<i className="dropdown-icon zmdi zmdi-circle-o text-warning" />
										<span>Busy</span>
									</a>
									<a className="dropdown-item" href="#">
										<i className="dropdown-icon zmdi zmdi-minus-circle-outline text-danger" />
										<span>Offline</span>
									</a>
								</div>
							</div> */}
							{/* <div className="dropdown-divider" /> */}
							<a className="dropdown-item" href="#" onClick={logoutUser}>
								<i className="dropdown-icon zmdi zmdi-power" />
								<span>Log out</span>
							</a>
						</div>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default DashboardHeader;
