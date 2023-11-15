import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "services/apiService";
import moment from "styles/vendors/moment/moment";
// import { useRouter } from 'next/router'
import { useFormik } from "formik";
import { object, number, string, boolean, array } from "yup";
import StyledInput, { StyledSelect } from "components/form/StyledInput";

const POIForm = ({ usData, data, localities, closeModal }) => {
	const fD = usData;
	const { createPOI, updatePOI } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched, setFieldValue } = useFormik({
		initialValues: {
           locality: data?.locality || "", 
           name: data?.name || "", 
           address: data?.address || "", 
           longitude: data?.longitude || "", 
           latitude: data?.latitude || "", 
           notes: data?.notes || "", 
		},
		validationSchema: object().shape({
            locality: string(),
            name: string(),
            address: string(),
            longitude: string(),
            latitude: string(),
            notes: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			if (fD?.id){
				const { isError, data, error } = await updatePOI(fD.id, formData);
				setSubmitting(false);
				if (isError) toast.error(error.message);
				else {
					toast.success("success");
					closeModal()
				}
			} else {
				const { isError, data, error } = await createPOI(formData);
				setSubmitting(false);
				if (isError) toast.error(error.message);
				else {
					toast.success("success");
					closeModal()
				}
			}
		}, 
	});
	console.log(values, errors)
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
					id="longitude"
					label="Longitude"
					type="text"
					name="longitude"
					formClassName="col-md-6"
					value={values.longitude}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.longitude}
					touched={touched.longitude}
				/>
				<StyledInput 
					id="latitude"
					label="Latidute"
					type="text"
					name="latitude"
					formClassName="col-md-6"
					value={values.latitude}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.latitude}
					touched={touched.latitude}
				/>
			</div>
			<div className="row">
				<StyledInput 
					id="address"
					label="Address"
					type="text"
					name="address"
					formClassName="col-md-6"
					value={values.address}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.address}
					touched={touched.address}
				/>	
				<StyledInput 
					id="notes"
					label="Notes"
					type="text"
					name="notes"
					formClassName="col-md-6"
					value={values.notes}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.notes}
					touched={touched.notes}
				/>
			</div>
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : fD?.id ? "Save" : "Create" }</button>
		</form>
	)
}

export default POIForm;