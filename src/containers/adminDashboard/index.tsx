import StyledTable from "../../components/StyledTable"
import { columParser } from "../../utils/tableParser"
import { getDataTableLabels } from "../../utils/utilities"
import { Pagination } from "baseui/pagination";
import { Table } from "baseui/table-semantic";
import { useEffect, useState } from "react";
import * as Styles from "./styles"
const AdminDashboardContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataTable, setDataTable] = useState(undefined)
    useEffect(() => {
        if (dataTable === undefined) {
            getDataTableLabels(0, 120).then(data => {
                setDataTable(data)
            })
        }
    }, [setDataTable, getDataTableLabels])

    const handlePagination = (nextPage) => {
        setCurrentPage(nextPage)
        setDataTable(getDataTableLabels(nextPage, 20))
    }
    const columns = [
        columParser({ type: "string", title: "idCliente", dataIndex: 0, format: "" }),
        columParser({ type: "string", title: "Paqueteria", dataIndex: 1, format: "" }),
        columParser({ type: "string", title: "Cp Origen", dataIndex: 2, format: "" }),
        columParser({ type: "string", title: "Cp Destino", dataIndex: 3, format: "" }),
        columParser({ type: "string", title: "No. Guia", dataIndex: 4, format: "" }),
        columParser({ type: "string", title: "Peso", dataIndex: 5, format: "" }),
        columParser({ type: "string", title: "Dimensiones", dataIndex: 6, format: "" }),
    ]

    return (
        <>
            <StyledTable cols={columns} data={dataTable} />
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