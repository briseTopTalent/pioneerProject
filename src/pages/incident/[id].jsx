import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import DashboardLayout from "components/layout/dashboard/layout";
import { useAuth } from "services/apiService";
import withPrivateRoute from "components/wrapper/withPrivateRoute";
import { Pages } from "utils/constants";

import CreateIncident from "pages/incident/create";

const FetchIncidentDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const { fetchSingleIncident, } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState({});

	const FetchData = async () => {
		const { isError, data, error } = await fetchSingleIncident(id);
		if (isError) {
			console.log(error, id);
			toast.error(error.data.message);
			router.push(`/${Pages.INCIDENT}`, {
				message: "Incident not Found",
			});
		} else {
			setUserData(data);
			console.log(data);
		}
		setIsLoading(false);
	};

	useEffect(async () => {
		await FetchData();
	}, [id]);

	return (
		<>
			<CreateIncident
				incidentId={router.query.id}
				userData={userData}
			/>
	</>
	);
};

export default withPrivateRoute(FetchIncidentDetailsPage);
