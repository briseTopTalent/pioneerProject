import Head from "next/head";
import React from "react";
import HeadTab from "./Head";

const PageLayout = ({ children, page }) => (
	<>
		<HeadTab page={page} />
		<div className="hk-wrapper">
			<div className="hk-pg-wrapper hk-auth-wrapper">{children}</div>
		</div>
	</>
);

export default PageLayout;
