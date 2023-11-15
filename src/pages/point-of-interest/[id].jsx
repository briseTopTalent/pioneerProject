
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import { object, number, string, boolean, array } from "yup";
import { MousePointer } from "react-feather";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";
import CustomModal from "components/modal";
import ConfirmModal from "components/modal/confirmModal";
import POIForm from "components/POI/POIForm";

const FetchIncidentDetailsPage = () => {
	const router = useRouter()
	const { id } = router.query
	const { fetchOnePOI, deletePOI, fetchAdminLocality, currentUser } = useAuth();
	const [ isLoading, setIsLoading ] = useState(true);
	const [ showEdit, setShowEdit ] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirming, setConfirming] = useState(false);
	const [ userData, setUserData ] = useState({});
	const [ component, setComponent ] = useState(null);
    const [ localities, setLocalities ] = useState([]);

	const FetchData = async () => {
		// if (id){
			const { isError, data, error } = await fetchOnePOI(id);
			if (isError) {
				console.log(error, id)
				toast.error(error.data.message)
				router.push(`/${Pages.POI}`, {
					message: "POI not Found"
				})
			} else {
				setUserData(data)
			}
			setIsLoading(false)
		// }
	}

    const fetchUserLocality = async () => {
        const { isError, data, error } = await fetchAdminLocality(currentUser.email);
        if (isError) toast.error(error.message);
        const l = data.data.map((t)=>{
            return { label: t.name, value: t.id }
        })
        setLocalities(l)
    }

	const SetModalView = (t, c) => {
		setComponent(c)
		setShowEdit(t);
	}

	useEffect(async ()=>{
		await fetchUserLocality();
	},[]);

	useEffect(async ()=>{
		await FetchData();
	},[id, showEdit]);

    const startDeleteModal = () => setConfirmModal(true)

	const RemovePOI = async () => {
        setConfirming(true);
        const { isError, data, error } = await deletePOI(id);
        if (isError) toast.error(error.message);
        else toast.success("success");
        setConfirming(false)
		router.push(`/${Pages.POI}`, {
			message: "POI Deleted"
		})
	}
	return(
		<DashboardLayout pageTitle={"Point of Interest"} isLoading={isLoading}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title"><span className="pg-title-icon"><MousePointer/></span>Point Of Interest Detail</h4>
				</div>
				<div className="d-flex button-list">
					<button onClick={()=>SetModalView(true, <POIForm usData={{id}} data={userData} localities={localities} closeModal={()=>SetModalView(false, null)}/>)} className="btn btn-info btn-sm">Edit</button>
					<button onClick={()=>startDeleteModal()} className="btn btn-danger btn-sm">Delete</button>
					{confirmModal && <ConfirmModal loading={confirming} show={confirmModal} closeModal={()=>setConfirmModal(false)} nextAction={() => RemovePOI()} />}
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>Locality</span>
						<h3>{userData?.ilocality?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Address</span>
						<h3>{userData?.address || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Longitude</span>
						<h3>{userData?.longitude || "-"}</h3>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span>Latitude</span>
						<h3>{userData?.latitude || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Notes</span>
						<h3>{userData?.notes || "-"}</h3>
					</div>
					<div className="col-sm"></div>
				</div>
			</section>
			{showEdit && <CustomModal centered={true} component={component} show={showEdit} title={"Edit Point Of Interest"} closeModal={()=>SetModalView(false, null)}/>}
		</DashboardLayout>
	)
};

export default withPrivateRoute(FetchIncidentDetailsPage);
