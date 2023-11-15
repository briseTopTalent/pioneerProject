import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Loader, MapPin } from "react-feather";
import { toast } from "react-toastify";
// import moment from "styles/vendors/moment/moment";

import DashboardLayout from "components/layout/dashboard/layout";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import Pagination from "components/pagination";
import { useAuth } from "services/apiService";
import { Pages } from "utils/constants";
import Button from "components/button";
import CustomModal from "components/modal";
import SUBLForm from "components/subLocality/Form";
import { StyledSelect } from "components/form/StyledInput";

const SubLocalityPage = () => {
    const { fetchSublocality, fetchAdminLocality, currentUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
	const [ showEdit, setShowEdit ] = useState(false);
    const [data, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [component, setComponent] = useState(null)
    const [localities, setLocalities] = useState([]);
    const [locality, setLocality] = useState(null);
    // const isSuperAdmin = currentUser?.isAdmin;
    
    useEffect(async()=> {
        await FetchData()
        await fetchUserLocality()
    },[]);

    const fetchUserLocality = async () => {
        const { isError, data, error } = await fetchAdminLocality(currentUser.email);
        if (isError) toast.error(error.message);
        const l = data.data.map((t)=>{
            return { label: t.name, value: t.id }
        })
        setLocalities(l)
    }

    const FetchData = async (l=null) => {
        const { isError, data, error } = await fetchSublocality(l, page, limit);
        if (isError) toast.error(error.message);
        setDatas(data.data)
        setPages(data.pages)
        setLoading(false);
    };
    const fetchByLocality = async (l) => {
        setLoading(true);
        await FetchData(l)
    }

	const SetModalView = (t, c) => {
		setComponent(c)
		setShowEdit(t);
	}

    const CloseModal = async () => {
        await SetModalView(false, null)
        await FetchData()
    }

    const routePage = (id, m) => {
        if (id) return router.push(`/${Pages.SUB_LOCALITY}/${id}`);
    }

	const pageNavigate = (page) => {
		setLoading(true);
		setPage(page);
    FetchData(locality);/*.then(({ isError, data, error }) => {
				if (isError) toast.error(error.message);
				console.log("dd-->", data);
				if (data?.data) {
          setDatas(data.data)
          setPages(data.pages)
				}
				setLoading(false);
			})
			.catch((error) => {
				alert(error);
				setLoading(false);
			});
      */
	};

    return (
        <DashboardLayout pageTitle={"Sub Locality"}>
            <div className="hk-pg-header">
                <h4 className="hk-pg-title">
                    <span className="pg-title-icon"><MapPin /></span>
                    Sub Locality
                </h4>
                <div className="d-flex">
					<button onClick={()=>SetModalView(true, <SUBLForm data={null} localities={localities} closeModal={CloseModal}/>)} className="btn btn-primary btn-sm">Create SubLocality</button>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="row mb-25">
                        <div className="col-sm-3">
                            <StyledSelect 
                                name={"select-locality"}
                                placeholder={"Select Locality"}
                                options={localities}
                            onChange={(e)=> { 
                              setLocality(e.target.value);
                              setPage(1);
                              fetchByLocality(e.target.value);
                            }}
                            />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body pa-0">
                            <div className="table-wrap">
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Locality</th>
                                                <th>Name</th>
                                                <th>Latitude</th>
                                                <th>Longitude</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!loading && data.map((u, i)=>
                                            <tr key={i} onClick={()=>routePage(u.email)} >
                                                <td>{i + 1}</td>
                                                <td>{u?.ilocality.name}</td>
                                                <td>{u?.name}</td>
                                                <td>{u?.latitude || "-"}</td>
                                                <td>{u?.longitude || "-"}</td>
                                                <td>
                                                    <Button label="View" variant="info" onClick={()=>routePage(u?.id)} />
                                                </td>
                                            </tr>)}
                                            {loading && <tr><td className="text-center" colSpan={10}>
                                                <Loader />
                                                <p>Loading...</p>
                                                </td></tr>}
                                            {!loading && data.length == 0 && <tr><td className="text-center" colSpan={10}>No data</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Pagination currentPage={page} clickAction={pageNavigate} totalPages={pages}/>
                </div>
            </div>
			{showEdit && <CustomModal centered={true} component={component} show={showEdit} title={"Create Sub Locality"} closeModal={()=>CloseModal()}/>}
        </DashboardLayout>
    )
};

export default withPrivateRoute(SubLocalityPage);
