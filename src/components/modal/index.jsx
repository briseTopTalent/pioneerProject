import React from "react";

const CustomModal = ({ component, title, show, closeModal, centered, customStyle = {} }) => {
	let styles = { display: show ? "block" : "none" };
	styles = Object.assign(styles, customStyle);
	return (
		<>
			<div className={`modal fade ${show ? "show" : ""}`} style={styles}>
				<div
					className={`modal-dialog ${centered ? "modal-dialog-centered" : ""}`}
					role="document"
				>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{title}</h5>
							<button type="button" className="close" onClick={closeModal}>
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">{component}</div>
					</div>
				</div>
			</div>
			{show && <div className="modal-backdrop fade show"></div>}
		</>
	);
};

export default CustomModal;
