import * as React from "react"
import StyledTable from "../../components/StyledTable"
import { columParser } from "../../utils/tableParser"
import { getDataTableLabels } from "../../utils/utilities"
import { useEffect, useState } from "react";
import { Tabs, Tab } from "baseui/tabs-motion";
import { Grid, Cell } from 'baseui/layout-grid';
import QuotesContainer from "../quotes";
import UsersDetails from "../../components/UsersDetails";
import { UserCtx } from "../../context/userContext";
import GeneralValuesSettingsContainer from "../generalValuesSettings";
import { Button } from "baseui/button";
import * as XLSX from 'xlsx';
import * as Styles from "./styles"
import ReportsContainer from "../reportes";
import { Select } from "baseui/select";
import { useRouter } from "next/dist/client/router";

const AdminDashboardContainer = () => {
    let userData = React.useContext(UserCtx)
    const [dataTable, setDataTable] = useState(undefined)
    const [activeKey, setActiveKey] = useState("0");
    const userDataHeader= localStorage.getItem('userData')
    console.log(userDataHeader)
    const router = useRouter()
    useEffect(() => {

        if (dataTable === undefined) {
            getDataTableLabels(0, 1500).then(data => {
                setDataTable(data)
                
            })
        }
    }, [setDataTable, getDataTableLabels])

    const columns = [
        columParser({ type: "string", title: "idCliente", dataIndex: 1, format: "" }),
        columParser({ type: "string", title: "Paqueteria", dataIndex: 2, format: "" }),
        columParser({ type: "string", title: "Cp Origen", dataIndex: 3, format: "" }),
        columParser({ type: "string", title: "Cp Destino", dataIndex: 4, format: "" }),
        columParser({ type: "string", title: "No. Guia", dataIndex: 5, format: "" }),
        columParser({ type: "string", title: "Peso", dataIndex: 6, format: "" }),
        columParser({ type: "string", title: "Alto", dataIndex: 7, format: "" }),
        columParser({ type: "string", title: "Ancho", dataIndex: 8, format: "" }),
        columParser({ type: "string", title: "Largo", dataIndex: 9, format: "" }),
        columParser({ type: "string", title:  "Numero de Rastreo", dataIndex: 10, format: ""}),

    ]
    const hadleLogOut=(params)=>{
        
        if (params.value[0].is===true) {
            router.push('/')
            localStorage.removeItem("userData")
            localStorage.removeItem("isLoggedIn")
            console.log(params.value[0].is)
        }
    }
    const handleDownloadAsXLSX = () => {
        console.log("its clicked")
        const worksheet = XLSX.utils.json_to_sheet(dataTable);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    }
    const options = [
        { label: " Cerrar Sesión  ", is:true },
    ]
    return (
        <>
        <Grid overrides={Styles.headerOverrides}><Cell span={2}><Select
                options={options}
                placeholder={userDataHeader}
                onChange={params => hadleLogOut(params)}
            /> </Cell></Grid>
            {/* <Tabs
                activeKey={activeKey}
                onChange={({ activeKey }) => {
                    setActiveKey(activeKey.toString());
                }}
                activateOnFocus
            > */}
            {userData.userName === "admin" ?
            
                <Tabs
                    activeKey={activeKey}
                    onChange={({ activeKey }) => {
                        setActiveKey(activeKey.toString());
                    }}
                    activateOnFocus
                >
                    
                    <Tab title="Guias Generadas">
                        <Button onClick={() => handleDownloadAsXLSX()}>Download as XLSX</Button>
                        <StyledTable cols={columns} data={dataTable} />
                    </Tab>
                    <Tab title="Gestion de usuarios">
                        <UsersDetails />
                    </Tab>
                    <Tab title="Cotizador">
                        <QuotesContainer />
                    </Tab>
                    <Tab title="Gestion valores">
                        <GeneralValuesSettingsContainer />
                    </Tab>
                    <Tab title="Reportes">
                        <ReportsContainer />
                    </Tab>
                </Tabs>
                :
                <Tabs
                    activeKey={activeKey}
                    onChange={({ activeKey }) => {
                        setActiveKey(activeKey.toString());
                    }}
                    activateOnFocus
                >
                    <Tab title="Cotizador">
                        <QuotesContainer />
                    </Tab>
                </Tabs>}

            {/* <StyledTable cols={columns} data={dataTable} /> */}
            {/* <Pagination
                numPages={20}
                currentPage={currentPage}
                overrides={Styles.PaginationOverrides}
                onPageChange={({ nextPage }) => {
                    handlePagination(nextPage)
                }}
            /> */}
        </>
    )
}

export default AdminDashboardContainer