
import * as React from "react"
import { Alert, Check } from 'baseui/icon';
import {
    StatefulDataTable,
    BooleanColumn,
    CategoricalColumn,
    NumericalColumn,
    StringColumn,
    NUMERICAL_FORMATS,
    BatchActionT,
    RowActionT,
} from 'baseui/data-table';




const StyledTable = ({ cols, data = [] }) => {
    const dataMapped = data.map((r) => ({ id: r[0], data: r }));
    const [rows, setRows] = React.useState(dataMapped);
    console.log("inside", data)


    function flagRows(ids: Array<string | number>) {
        const nextRows = rows.map((row) => {
            if (ids.includes(row.id)) {
                const nextData = [...row.data];
                nextData[1] = !nextData[1];
                return { ...row, data: nextData };
            }
            return row;
        });
        setRows(nextRows);
    }
    function flagRow(id: string | number) {
        flagRows([id]);
    }
    function removeRows(ids: Array<string | number>) {
        const nextRows = rows.filter((row) => !ids.includes(row.id));
        setRows(nextRows);
    }
    function removeRow(id: string | number) {
        removeRows([id]);
    }

    const batchActions: BatchActionT[] = [
        {
            label: 'Check',
            onClick: ({ selection, clearSelection }) => {
                flagRows(selection.map((r) => r.id));
                clearSelection();
            },
            renderIcon: Check,
        },
        {
            label: 'Remove',
            onClick: ({ selection, clearSelection }) => {
                removeRows(selection.map((r) => r.id));
                clearSelection();
            },
            renderIcon: Alert,
        },
        {
            label: 'Download',
            onClick: ({ clearSelection }) => clearSelection(),
        },
    ];
    const rowActions: RowActionT[] = [
        {
            label: 'Check',
            onClick: ({ row }) => flagRow(row.id),
            renderIcon: Check,
        },
        {
            label: 'Remove',
            onClick: ({ row }) => removeRow(row.id),
            renderIcon: Alert,
        },
    ];

    return (
        <div style={{ height: '90vh' }}>
            <StatefulDataTable
                columns={cols}
                rows={dataMapped}
            />
        </div>
    );
}

export default StyledTable