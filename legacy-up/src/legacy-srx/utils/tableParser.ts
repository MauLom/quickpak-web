import {
    StatefulDataTable,
    BooleanColumn,
    CategoricalColumn,
    NumericalColumn,
    StringColumn,
    BatchActionT,
    RowActionT,
} from 'baseui/data-table';

export const columParser = (columnObject = { type: "", title: "", dataIndex: 0, format:"" }) => {
    switch (columnObject.type) {
        case "string":
            return StringColumn({
                title: columnObject.title,
                mapDataToValue: (data: string) => data[columnObject.dataIndex],
            })
        case "boolean":
            return BooleanColumn({
                title: columnObject.title,
                mapDataToValue: (data: boolean) => data[columnObject.dataIndex],
            })
        case "categorical":
            return CategoricalColumn({
                title: columnObject.title,
                mapDataToValue: (data: string) => data[columnObject.dataIndex],
            })
        case "numeric":
            return NumericalColumn({
                title: columnObject.title,
                mapDataToValue: (data: number) => data[columnObject.dataIndex],
                format: columnObject.format
            })
        default:
            return console.error("Not type defined for col: ", columnObject.title)
    }

}