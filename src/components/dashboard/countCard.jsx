import React from "react";

const CountCard = ({title, value}) => {
    return(
        <div className="col-md-4">
            <div className="card card-sm">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <span className="d-block font-12 font-weight-500 text-dark text-uppercase mb-5">{title}</span>
                            <span className="d-block display-6 font-weight-400 text-dark">{value}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountCard;
