import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "services/apiService";
import moment from "styles/vendors/moment/moment";
// import { useRouter } from 'next/router'
import { useFormik } from "formik";
import { object, number, string, boolean, array } from "yup";
import StyledInput, { StyledSelect } from "components/form/StyledInput";

const SUBLForm = ({ usData, data, localities, closeModal }) => {
	const fD = usData;
	const { createSublocality, updateSublocality } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched, setFieldValue } = useFormik({
		initialValues: {
           locality: data?.locality || "", 
           name: data?.name || "", 
           latitude: data?.latitude.toString() || "", 
           longitude: data?.longitude.toString() || "", 
		},
		validationSchema: object().shape({
            locality: string(),
            name: string(),
            latitude: string(),
            longitude: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			if (fD?.id){
				const { isError, data, error } = await updateSublocality(fD.id, formData);
				setSubmitting(false);
				if (isError) toast.error(error.message);
				else {
					toast.success("success");
					closeModal()
				}
			} else {
				const { isError, data, error } = await createSublocality(formData);
				setSubmitting(false);
				if (isError) toast.error(error.message);
				else {
					toast.success("success");
					closeModal()
				}
			}
		}, 
	});
	return(
		<form onSubmit={handleSubmit}>
			<div className="row">
				<StyledSelect 
					id="Locality"
					label="Locality"
					type="text"
					formClassName="col-md-6"
					name="locality"
					value={values.locality}
					options={localities}
					placeholder="Select Locality"
					onChange={(e) => {
						setFieldValue("locality", e.target.value)
					}}
					onBlur={handleBlur}
					error={errors.locality}
					touched={touched.locality}
				/>
				<StyledInput 
					id="name"
					label="Name"
					type="text"
					name="name"
					formClassName="col-md-6"
					value={values.name}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.name}
					touched={touched.name}
				/>
			</div>

			<div className="row">
				<StyledInput 
					id="latitude"
					label="Latitude"
					type="text"
					formClassName="col-md-6"
					name="latitude"
					value={values.latitude}
					placeholder="Enter Latitude"
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.latitude}
					touched={touched.latitude}
				/>
				<StyledInput 
					id="longitude"
					label="Longitude"
					type="text"
					formClassName="col-md-6"
					name="longitude"
					value={values.longitude}
					placeholder="Enter Longitude"
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.longitude}
					touched={touched.longitude}
				/>
			</div>
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : fD?.id ? "Save" : "Create" }</button>
		</form>
	)
}

export default SUBLForm;