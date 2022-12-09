import { Input } from "baseui/input"
import { LabelMedium } from "baseui/typography"
import * as Styles from "./styles"

const StyledInput = ({ inputTitle = "", type = "text", enchancers = [] }) => {

    return (
        <>
            {inputTitle !== "" && <LabelMedium>{inputTitle}</LabelMedium>}
            <Input type={type} overrides={Styles.InputStyleOverride} />
        </>
    )
}


export default StyledInput