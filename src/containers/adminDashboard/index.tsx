import StyledTable from "../../components/StyledTable"
import { columParser } from "../../utils/tableParser"
import { getDataTableLabels } from "../../utils/utilities"
import { Pagination } from "baseui/pagination";
import { Table } from "baseui/table-semantic";
import { useEffect, useState } from "react";
import * as Styles from "./styles"
import { Tabs, Tab } from "baseui/tabs-motion";
import EditUserForm from "../../components/EditUserForm";
import QuotesContainer from "../quotes";
const AdminDashboardContainer = () => {
    const [dataTable, setDataTable] = useState(undefined)
    const [activeKey, setActiveKey] = useState("0");
    useEffect(() => {
        if (dataTable === undefined) {
            getDataTableLabels(0, 120).then(data => {
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
        columParser({ type: "string", title: "Dimensiones", dataIndex: 7, format: "" }),
    ]

    return (
        <>
            <Tabs
                activeKey={activeKey}
                onChange={({ activeKey }) => {
                    setActiveKey(activeKey);
                }}
                activateOnFocus
            >
                <Tab title="Guias Generadas">
                    <StyledTable cols={columns} data={dataTable} />
                </Tab>

                <Tab title="Gestion de usuarios">
                    <EditUserForm />
                </Tab>
                <Tab title="Cotizador">
                    <QuotesContainer />
                </Tab>
            </Tabs>
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