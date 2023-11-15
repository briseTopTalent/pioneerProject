import React from "react";

const DashboardFooter = () => {
	const d = new Date();
	const year = d.getFullYear();
	return (
		<>
			<div className="hk-footer-wrap container">
				<footer className="footer">
					<div className="row">
						<div className="col-md-6 col-sm-12">
							<p> © {year} </p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default DashboardFooter;
