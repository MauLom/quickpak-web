import * as React from "react"

import { Select } from "baseui/select";
import { UserCtx } from "../../context/userContext";
import { Chart } from "react-google-charts";
import { dataReports, dataTraking } from "../../utils/utilities";
import { getAllUsers } from '../../services/users';

const ReportsContainer = () => {
    const userData = React.useContext(UserCtx)
    const [userQuotes, setUserQuotes] = React.useState();
    const [userId, setUserId] = React.useState("")
    const [dataUserGuides, setDataUserGuides] = React.useState(0);
    const [dataUserTracking, setDataUserTracking]= React.useState(0);
    const [dataUserPrice, setDataUserPrice]= React.useState(0);
    const [userOptions, setUserOptions] = React.useState([])

    const handleChangeUser = (params) => {
        setUserId(params.value[0].id)
        setUserQuotes(params.value)
        dataReports(params.value[0].id).then(data=>{
            setDataUserGuides(data.length)
        })
        dataTraking(params.value[0].id).then(data=>{
            setDataUserTracking(data.length)
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

    const usersOptions =  getAllUsers().then(res=>{
        const options=[]
        res?.data.forEach(eachUser=>{
            let newUser = {label: eachUser.referencia, id:eachUser.idServices}
            options.push(newUser)
        })
        setUserOptions(options)
    })

    return (
        <>
            {userData.userName === "admin" && <Select
                options={userOptions}
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