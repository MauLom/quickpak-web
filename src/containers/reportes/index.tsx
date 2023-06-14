import * as React from "react"

import { Select } from "baseui/select";
import { UserCtx } from "../../context/userContext";
import { Chart } from "react-google-charts";
import { dataReports, dataTraking } from "../../utils/utilities";

const ReportsContainer = () => {
    const userData = React.useContext(UserCtx)
    const [userQuotes, setUserQuotes] = React.useState();
    const [userId, setUserId] = React.useState("")
    const [dataUserGuides, setDataUserGuides] = React.useState(0);
    const [dataUserTracking, setDataUserTracking]= React.useState(0);
    const [dataUserPrice, setDataUserPrice]= React.useState(0);
    const handleChangeUser = (params) => {
        setUserId(params.value[0].id)
        setUserQuotes(params.value)
        console.log(params.value[0].id)
        dataReports(params.value[0].id).then(data=>{
            setDataUserGuides(data.length)
            console.log('guias generadas',data.length)
        })
        dataTraking(params.value[0].id).then(data=>{
            setDataUserTracking(data.length)
            console.log('guias con rastreo',data.length)
        })
    }
    const data = [
        ["Totales", "Total: "],
        ["Guias generadas", dataUserGuides],
        ["Guias con rastreo", dataUserTracking],
        ["Monto de cotizaciones", dataUserPrice],
        
    ];
    const options = {
        title: "Reporte de cotizaciones",
        subtitle:"Totales"
    };
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
            <br />
            <br />
            <Chart
                chartType="Bar"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
            />
        </>
    )
}

export default ReportsContainer;