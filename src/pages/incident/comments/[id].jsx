import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { object, number, string, boolean, array } from "yup";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";
import CustomModal from "components/modal";
import StyledInput, { StyledAddressInput, StyledSelect } from "components/form/StyledInput";
import ConfirmModal from "components/modal/confirmModal";

const FetchIncidentDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const {
		fetchIncidentComments,
		fetchSingleIncident,
		fetchLocalityDefinitions,
		deleteIncident,
		deleteComment,
	} = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [showEdit, setShowEdit] = useState(false);
	const [editComment, setEditComment] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [confirming, setConfirming] = useState(false);
	const [userData, setUserData] = useState({});
	const [definitions, setDefinitions] = useState(null);
	const [component, setComponent] = useState(null);
	const [comments, setComments] = useState([]);
	const [showAddComment, setShowAddComment] = useState(true); //FIXME change to false on PR
	const [incidentId, setIncidentId] = useState(id);

	const FetchData = async () => {
		{
			let { isError, data, error } = await fetchSingleIncident(id);
			if (isError) {
				console.log(error, id);
				toast.error(error.data.message);
				//router.push(`/comments`, {
				//	message: "Incident not Found"
				//})
			} else {
				setUserData(data);
				//console.log(data)
				//FetchDefinitions(data.locality)
			}
		}
		{
			const { isError, data, error } = await fetchIncidentComments(id);
			if (isError) {
				console.log(error, id);
				toast.error(error.data.message);
				//router.push(`/comments`, {
				//	message: "Incident not Found"
				//})
			} else {
				console.log({ data });
				setComments(data.data);
				//setUserData(data)
				//console.log(data)
				//FetchDefinitions(data.locality)
			}
			setIsLoading(false);
		}
	};

	const removeComment = async (comment) => {
		console.debug({ comment });
		if (confirm("Are you sure you want to delete this comment?")) {
			const { isError, data, error } = await deleteComment(comment.id);
			if (isError) {
				console.log({ error, id, data });
				toast.error(error.data.message);
			} else {
				window.location.reload();
			}
		}
	};

	const FetchDefinitions = async (id) => {
		const { isError, data, error } = await fetchLocalityDefinitions(id);
		if (isError) {
			console.log(error, id);
			toast.error(error.data.message);
		} else {
			setDefinitions(data);
		}
		setIsLoading(false);
	};

	const SetModalView = (t, c) => {
		setComponent(c);
		setShowEdit(t);
	};

	useEffect(async () => {
		await FetchData();
		// await FetchDefinitions();
	}, [id, showEdit]);

	const startDeleteModal = () => setConfirmModal(true);

	const RemoveIncident = async () => {
		setConfirming(true);
		const { isError, data, error } = await deleteIncident(id);
		if (isError) toast.error(error.message);
		else toast.success("success");
		setConfirming(false);
		router.push(`/${Pages.INCIDENT}`, {
			message: "Incident Deleted",
		});
	};
	return (
		<DashboardLayout pageTitle={"Incident"} isLoading={isLoading}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title">
						<span className="pg-title-icon">
							<span className="feather-icon">
								<i data-feather="book"></i>
							</span>
						</span>
						Incident Detail
					</h4>
				</div>
				<div className="d-flex button-list">
					<button
						onClick={() =>
							SetModalView(
								true,
								<EditForm
									Data={{ incidentId: id }}
									closeModal={() => SetModalView(false, null)}
								/>
							)
						}
						className="btn btn-info btn-sm"
					>
						Add Comment
					</button>
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>Locality</span>
						<h3>{userData?.ilocality?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Sub Locality</span>
						<h3>{userData?.iSlocality?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Address</span>
						<h3>{userData?.address || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Longitude</span>
						<h3>{userData?.longitude || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Latitude</span>
						<h3>{userData?.latitude || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Responding Units</span>
						<h3>
							{userData?.responding_units?.map((r) => {
								return <li>{r}</li>;
							})}
						</h3>
					</div>
				</div>
				<hr />
				{/* {definitions && 
				<> */}
				<div className="row">
					<div className="col-sm-4">
						<span>Featured</span>
						<h3>{userData?.featured ? "true" : "false"}</h3>
					</div>
					<div className="col-sm-4">
						<span>Created By</span>
						<h3>
							{userData?.createdBy
								? userData?.createdBy?.first_name +
								  " " +
								  userData?.createdBy?.last_name
								: "-"}
						</h3>
					</div>
				</div>
				<hr />
				<div className="col-sm">
					<h3>Comments</h3>
					<div>
						{comments?.map((r) => {
							console.debug({ r });
							return (
								<ul>
									<li>
										<u>
											<b>
												{r.UserInfo
													? r.UserInfo.first_name +
													  " " +
													  r.UserInfo.last_name
													: `User${r.userId}`}
											</b>
										</u>
										: {r.comment}
										<button
											className="btn-danger"
											type="button"
											id={`comment_${r.id}`}
											onClick={() => removeComment(r)}
										>
											Delete
										</button>
									</li>
								</ul>
							);
						})}
					</div>
				</div>
				<div className="row">
					{definitions?.field1_name && (
						<div className="col-sm">
							<span>{definitions?.field1_name} </span>
							<h3>{userData?.field1_value || "-"}</h3>
						</div>
					)}
					{definitions?.field2_name && (
						<div className="col-sm">
							<span>{definitions?.field2_name} </span>
							<h3>{userData?.field2_value || "-"}</h3>
						</div>
					)}
				</div>
				<hr />
				<div className="row">
					{definitions?.field3_name && (
						<div className="col-sm">
							<span>{definitions?.field3_name} </span>
							<h3>{userData?.field3_value || "-"}</h3>
						</div>
					)}
					{definitions?.field4_name && (
						<div className="col-sm">
							<span>{definitions?.field4_name} </span>
							<h3>{userData?.field4_value || "-"}</h3>
						</div>
					)}
					{definitions?.field5_name && (
						<div className="col-sm">
							<span>{definitions?.field5_name} </span>
							<h3>{userData?.field5_value || "-"}</h3>
						</div>
					)}
				</div>
				<div className="row">
					<h1>Row</h1>
				</div>
				{/* </>} */}
			</section>
			{showEdit && (
				<CustomModal
					component={component}
					show={showEdit}
					title={"Add Incident Comment"}
					closeModal={() => SetModalView(false, null)}
				/>
			)}
		</DashboardLayout>
	);
};

const EditForm = ({ Data, closeModal }) => {
	const { createNewIncidentComment } = useAuth();
	const commentInput = useRef();
	console.debug({ Data });
	const incidentData = Data;
	async function submit() {
		const formData = {
			comment: commentInput.current.value,
			incident_id: parseInt(incidentData.incidentId, 10),
		};
		console.log("saving", { formData, incidentData });
		const { isError, data, error } = await createNewIncidentComment(formData);
		console.log(isError, data, error);
		if (isError) {
			toast.error(error.message);
			return false;
		} else {
			toast.success("success");
			closeModal();
		}
		return false;
	}
	return (
		<form>
			<div className="row">
				<textarea ref={commentInput} className="col-lg-12" rows="10" cols="80"></textarea>
			</div>

			<button className="btn btn-primary btn-block" type="button" onClick={submit}>
				Save
			</button>
		</form>
	);
};

export default withPrivateRoute(FetchIncidentDetailsPage);
