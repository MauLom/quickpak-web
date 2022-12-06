import { Card } from "baseui/card"
import {LoginContainerCardStyle, CardOverrides} from "./styles"
const LoginContainer = () => {
    return (
        <LoginContainerCardStyle>
            <Card overrides={CardOverrides}>
                This is the login container
            </Card>
        </LoginContainerCardStyle>
    )
}
export default LoginContainer