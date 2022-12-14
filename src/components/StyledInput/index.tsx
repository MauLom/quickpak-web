import { Input } from "baseui/input"
import { LabelMedium } from "baseui/typography"
import PropTypes from 'prop-types';
import * as Styles from "./styles"


const StyledInput = ({ inputTitle, inputType, id, name, placeholder }) => {

    return (
        <>
            {inputTitle !== "" && <LabelMedium>{inputTitle}</LabelMedium>}
            <Input id={id} name={name} placeholder={placeholder} type={inputType} overrides={Styles.InputStyleOverride} />
        </>
    )
}

// StyledInput.propTypes = {
//     inputTitle: PropTypes.string,
//     inputType: PropTypes.oneOf(["text", "number", "password", "email", "date", "file"])

// }

// StyledInput.defaultProps ={
//     inputType:"text",
//     placeholder:"You should probably use a placmeholder"
// }

export default StyledInput