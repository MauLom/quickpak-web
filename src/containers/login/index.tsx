import { Card } from "baseui/card"
import { Grid, Cell } from 'baseui/layout-grid';
import StyledInput from "../../components/StyledInput"
import { Button } from "baseui/button";
import * as Styles from "./styles"
const LoginContainer = () => {
    return (
        <Styles.LoginContainerCardStyle>
            <Card overrides={Styles.CardOverrides}>
                <Grid overrides={Styles.GridOverrides}>
                    <Cell span={12}>
                        <StyledInput inputTitle="Usuario" />
                    </Cell>
                    <Cell span={12}>
                        <StyledInput inputTitle="Clave" type="password" />
                    </Cell>
                    <Cell span={12}>
                        <Button overrides={Styles.ButtonOverrides} onClick={() => alert("click")}>Iniciar sesion</Button>
                    </Cell>
                </Grid>

            </Card>
        </Styles.LoginContainerCardStyle>
    )
}
export default LoginContainer