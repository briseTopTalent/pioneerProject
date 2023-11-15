const { default: Button } = require("components/button")
const { default: CustomModal } = require(".")

const ConfirmModal = ({ loading, show, closeModal, nextAction }) => {
    return(
        <CustomModal 
            component={
                <>
                    <div className="row text-center">
                        <div className="col-sm">
                            <div className="button-list">
                                <Button label={!loading ? "Confirm" : "loading..."} variant="danger" size="lg" onClick={nextAction} disabled={loading}/>
                                <Button label="Cancel" variant="info" size="lg" onClick={closeModal} disabled={loading}/>
                            </div>
                        </div>
                    </div>
                </>
            }
            centered={true}
            show={show} title={"Are You Sure You Want to proceed?"} closeModal={closeModal}
        />
    )
}
export default ConfirmModal;