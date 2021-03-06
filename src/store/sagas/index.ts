import {fork, all} from "redux-saga/effects";

import auth from "./auth";
import user from "./user";
import booking from "./booking";

export default function* rootSaga() {
    yield all([
        fork(auth),
        fork(user),
        fork(booking)
    ])
}
