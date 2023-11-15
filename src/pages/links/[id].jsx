
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { MousePointer, Rss } from "react-feather";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";
import CustomModal from "components/modal";
import ConfirmModal from "components/modal/confirmModal";
import LinkForm from "components/Link/SFForm";

const ScannerFeedDetails = () => {
	const router = useRouter()
	const { id } = router.query
	const { fetchOneLink, deleteLink, fetchAdminLocality, currentUser } = useAuth();
	const [ isLoading, setIsLoading ] = useState(true);
	const [ showEdit, setShowEdit ] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirming, setConfirming] = useState(false);
	const [ userData, setUserData ] = useState({});
	const [ component, setComponent ] = useState(null);
    const [ localities, setLocalities ] = useState([]);

	const FetchData = async () => {
		// if (id){
			const { isError, data, error } = await fetchOneLink(id);
			if (isError) {
				console.log(error, id)
				toast.error(error.data.message)
				router.push(`/${Pages.POI}`, {
					message: "Link not Found"
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

	const Remove = async () => {
        setConfirming(true);
        const { isError, data, error } = await deleteLink(id);
        if (isError) toast.error(error.message);
        else toast.success("success");
        setConfirming(false)
		router.push(`/${Pages.SCANNER_FEED}`, {
			message: "POI Deleted"
		})
	}
	return(
		<DashboardLayout pageTitle={"Link"} isLoading={isLoading}>
			<div className="hk-pg-header mb-10">
				<div>
					<h4 className="hk-pg-title"><span className="pg-title-icon"><Rss/></span>Scanner Feed Detail</h4>
				</div>
				<div className="d-flex button-list">
					<button onClick={()=>SetModalView(true, <LinkForm usData={{id}} data={userData} localities={localities} closeModal={()=>SetModalView(false, null)}/>)} className="btn btn-info btn-sm">Edit</button>
					<button onClick={()=>startDeleteModal()} className="btn btn-danger btn-sm">Delete</button>
					{confirmModal && <ConfirmModal loading={confirming} show={confirmModal} closeModal={()=>setConfirmModal(false)} nextAction={() => Remove()} />}
				</div>
			</div>
			<section className="hk-sec-wrapper">
				<div className="row">
					<div className="col-sm">
						<span>Locality</span>
						<h3>{userData?.ilocality?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Name</span>
						<h3>{userData?.name || "-"}</h3>
					</div>
					<div className="col-sm">
						<span>Url</span>
						<h3>{userData?.url || "-"}</h3>
					</div>
				</div>
			</section>
			{showEdit && <CustomModal component={component} show={showEdit} title={"Edit Link"} closeModal={()=>SetModalView(false, null)}/>}
		</DashboardLayout>
	)
};

export default withPrivateRoute(ScannerFeedDetails);