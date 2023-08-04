import { Card } from "baseui/card"
import { Grid, Cell } from 'baseui/layout-grid';
import * as React from "react"

const EditPackageandServices = ({ dataUser }) => {
return(
    <Card>
        <Grid>
            <Cell span={12}><h2>Configuración de servicios de paqueterias</h2> </Cell>
            <Cell span={12}><hr /></Cell>
        </Grid>
    </Card>
)

}
export default EditPackageandServices;