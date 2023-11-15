import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "services/apiService";
import moment from "styles/vendors/moment/moment";
// import { useRouter } from 'next/router'
import { useFormik } from "formik";
import { object, number, string, boolean, array } from "yup";
import StyledInput, { StyledSelect } from "components/form/StyledInput";

const PForm = ({ usData, data, localities, closeModal }) => {
	const fD = usData;
	const { createSF, updateSF } = useAuth();
	const { values, handleChange, handleBlur, handleSubmit, isSubmitting, setSubmitting, errors, touched, setFieldValue } = useFormik({
		initialValues: {
           locality: data?.locality || "", 
           name: data?.name || "", 
           url: data?.url || "", 
		},
		validationSchema: object().shape({
            locality: string(),
            name: string(),
            url: string(),
		}),
		onSubmit: async (formData) => {
			setSubmitting(true);
			if (fD?.id){
				const { isError, data, error } = await updateSF(fD.id, formData);
				setSubmitting(false);
				if (isError) toast.error(error.message);
				else {
					toast.success("success");
					closeModal()
				}
			} else {
				const { isError, data, error } = await createSF(formData);
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
					formClassName="col-md-12"
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
			</div>
			<div className="row">
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
				<StyledInput 
					id="url"
					label="Url"
					type="text"
					name="url"
					formClassName="col-md-6"
					value={values.url}
					onChange={handleChange}
					onBlur={handleBlur}
					error={errors.url}
					touched={touched.url}
				/>
			</div>
			<button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : fD?.id ? "Save" : "Create" }</button>
		</form>
	)
}

export default PForm;