
import React, { useState } from "react";
import { Activity, AlertOctagon, Calendar, Link2, MapPin, MousePointer, Rss, Users } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "services/apiService";

const SideRoutes = [
	{ name: "Dashboard", route: "/", icon: <Activity />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Users", route: "/users", icon: <Users />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Localities", route: "/locality", icon: <MapPin />, permissions:['admin', 'super' ]},
	{ name: "Sub-Localities", route: "/sub-locality", icon: <MapPin />, permissions:['admin', 'super'] },
	{ name: "Incidents", route: "/incident", icon: <AlertOctagon />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Calendar Events", route: "/events", icon: <Calendar />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Point Of Interest", route: "/point-of-interest", icon: <MousePointer />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Scanner Feeds", route: "/scanner-feed", icon: <Rss />, permissions:['admin', 'super', 'sub_admin'] },
	{ name: "Links", route: "/links", icon: <Link2 />, permissions:['admin', 'super', 'sub_admin'] },
]
const isActive = (activepath, path) => {
	if (activepath===path){
		return true;
	} else if ((path != "/" && activepath.includes(path))) {
		return true
	}
	return false;
}

const DashboardSideBar = () =>{
	const router = useRouter();
	const { currentUser } = useAuth();
	return (
		<>
			<nav className="hk-nav hk-nav-light">
				<a href="#" id="hk_nav_close" className="hk-nav-close">
					<span className="feather-icon">
						<i data-feather="x" />
					</span>
				</a>
				<div className="nicescroll-bar">
					<div className="navbar-nav-wrap">
						<div className="nav-header">
							<span>Navigation</span>
							<span>NS</span>
						</div>
						<ul className="navbar-nav flex-column">
						{currentUser?.role && SideRoutes.map((s,i) => s.permissions.includes(currentUser?.role) ? <li key={i} className={`nav-item ${isActive(router.pathname, s.route ) ? "active" : ""}`}>
								{s.children && s.children.length > 0 ?
									<DropMenu name={s.name} icon={s.icon} children={s.children} />
								:
									<Link href={s.route} replace={true} passHref>
										<a className="nav-link">
											<span className="feather-icon">{s.icon}</span>
											<span className="nav-link-text">{s.name}</span>
										</a>
									</Link>
								}
							</li> : <></>
						)}
						</ul>
					</div>
				</div>
			</nav>
			<div id="hk_nav_backdrop" className="hk-nav-backdrop" />
		</>
	)
};

const DropMenu = ({ name, icon, children }) => {
	const [show, setShow] = useState(false);
	return(
		<>
			<a className={`nav-link`} data-toggle="collapse" data-target="#dash_drp" onClick={()=>setShow(!show)}>
				<span className="feather-icon">{icon}</span>
				<span className="nav-link-text">{name}</span>
			</a>

			{children && <ul id="dash_drp" className={`nav flex-column collapse collapse-level-1 ${show? "show" : "" }`}>
				{children.map(()=><li className="nav-item">
					<ul className="nav flex-column">
						<li className="nav-item">
							<a className="nav-link" href="dashboard1.html">CRM</a>
						</li>
					</ul>
				</li>)}
			</ul>}
		</>
	)
}

export default DashboardSideBar;
