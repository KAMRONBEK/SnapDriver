import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";

import CurrentTripPanelController from "./controller";
import booking from "@store/actions/booking";

const mapStateToProps = ({booking: {newOrder},  map: {destination}}: any) => ({
    newOrder,
    destination
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        ChangeOrderStatus: booking.ChangeOrderStatus
    }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrentTripPanelController);
