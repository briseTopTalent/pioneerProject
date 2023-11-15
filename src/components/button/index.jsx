const Button = ({ onClick, label, type, variant = "info", size = "sm" }) => {
	return (
		<button type={type} className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
			{label}
		</button>
	);
};

export default Button;
