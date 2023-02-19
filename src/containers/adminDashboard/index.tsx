import StyledTable from "../../components/StyledTable"
import { columParser } from "../../utils/tableParser"
import { getDataTableLabels } from "../../utils/utilities"
import { useEffect, useState } from "react";
import { Tabs, Tab } from "baseui/tabs-motion";
import QuotesContainer from "../quotes";
import UsersDetails from "../../components/UsersDetails";
const AdminDashboardContainer = () => {
    let userType = undefined
    const [dataTable, setDataTable] = useState(undefined)
    const [activeKey, setActiveKey] = useState("0");
    useEffect(() => {
        if (window) {
           userType = sessionStorage.getItem("userType")
        }
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

    ]

    return (
        <>
            {/* <Tabs
                activeKey={activeKey}
                onChange={({ activeKey }) => {
                    setActiveKey(activeKey.toString());
                }}
                activateOnFocus
            > */}
            {userType === "admin" ?
                <Tabs
                    activeKey={activeKey}
                    onChange={({ activeKey }) => {
                        setActiveKey(activeKey.toString());
                    }}
                    activateOnFocus
                >
                    <Tab title="Guias Generadas">
                        <StyledTable cols={columns} data={dataTable} />
                    </Tab>

                    <Tab title="Gestion de usuarios">
                        <UsersDetails />
                    </Tab>
                    <Tab title="Cotizador">
                        <QuotesContainer />
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