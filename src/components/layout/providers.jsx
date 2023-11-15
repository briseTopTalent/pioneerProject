/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import PropTypes from "prop-types";
// import AlertTemplate from "react-alert-template-basic";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AuthProvider } from "services/apiService";

/* ---------------PropType Check---------------- */

const propTypes = {
	children: PropTypes.node,
};

const Providers = ({ children }) => (
	<AuthProvider>{children}</AuthProvider>
);

Providers.propTypes = propTypes;

export default Providers;
