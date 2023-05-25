import * as React from "react"

import { Select } from "baseui/select";
import { UserCtx } from "../../context/userContext";

const ReportsContainer = () => {
    const userData = React.useContext(UserCtx)
    const [userQuotes, setUserQuotes] = React.useState();
    const [userId, setUserId] = React.useState("")
    const handleChangeUser = (params) => {
        setUserId(params.value[0].id)
        setUserQuotes(params.value)
    }
    const optionsUsers = [
        { label: "REDBOX", id: "4xUVTqVZ1n1FuBikezmQ" },
        { label: "SRS Express", id: "enc0UiLq0oNXm1GTFHB8" },
    ]

    return (
        <>
            {userData.userName === "admin" && <Select
                options={optionsUsers}
                value={userQuotes}
                placeholder="Selecciona el usuario para cotizar"
                onChange={params => handleChangeUser(params)}
            />}
            Youre on reports
        </>
    )
}

export default ReportsContainer;