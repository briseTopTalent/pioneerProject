import Head from "next/head";
import React, { useState } from "react";
import HeadTab from "../Head";

import PageLoader from "../loader";
import DashboardFooter from "./footer";
import DashboardHeader from "./header";
import DashboardSideBar from "./sidebar";

const DashboardLayout = ({ loading=false, children, pageTitle }) => {
	const [showSide, setShowSide] = useState(true)
	const handleSiderBarToggle = () => setShowSide(!showSide);
	return (
	<>
		<HeadTab page={pageTitle}/>
		<div className={`hk-wrapper hk-vertical-nav ${showSide ? "" :"hk-nav-toggle"}`}>
			<DashboardHeader toggleSidebar={handleSiderBarToggle}/>
			<DashboardSideBar />
			<div className="hk-pg-wrapper" style={{ minHeight: "100vh" }}>
				{/* {loading && <PageLoader />} */}
				<div className="container mt-xl-50 mt-sm-30 mt-15">
					{children}
				</div>
				<DashboardFooter />
			</div>
		</div>
	</>
	)
};

export default DashboardLayout;
