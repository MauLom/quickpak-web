import React from 'react';
import { Card } from "baseui/card";
import { FormControl } from "baseui/form-control";
import { Input } from 'baseui/input';
import { Spreadsheet } from 'react-spreadsheet';
import {
    DisplaySmall,
} from 'baseui/typography';
import { Select } from "baseui/select";
import { Button } from "baseui/button";
import * as Styles from "./styles"
import * as StaticData from "./staticData"
const EditUserForm = ({ dataUser, changeUserData }) => {
    const [serviceMatrizEstafeta, setServiceMatrizEstafeta] = React.useState([])
    const [serviceMatrizDHL, setServiceMatrizDHL] = React.useState([])
    const [userName, setUserName] = React.useState("")
    const [matrizEstafeta, setMatrizEstafeta] = React.useState([])
    const [matrizDHL, setMatrizDHL] = React.useState([])
    const handleChangeServicesDHL = (params) => {
        const labelServiceStr = params.value[0]?.value
        setServiceMatrizDHL(params.value)

        if (Object.keys(dataUser).length > 0 && null !== labelServiceStr && undefined !== labelServiceStr) {
            setMatrizDHL(dataUser.matriz.DHL[labelServiceStr])
        }
    }
    const handleChangeServicesEstafeta = (params) => {
        const labelServiceStr = params?.value[0]?.value
        setServiceMatrizEstafeta(params.value)
        if (Object.keys(dataUser).length > 0 && null !== labelServiceStr && undefined !== labelServiceStr) {
            setMatrizEstafeta(dataUser.matriz.Estafeta[labelServiceStr])
        }
    }
    const handleSubmitButton = () => {
        var length = 20
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        var charLength = chars.length;
        var result = '';
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }

        alert("informacion guarda con exito " + result)
        const URLlogin = "https://clownfish-app-b2q4a.ondigitalocean.app/quickpak-node2/getUsers/register"
        // const estfetaService = serviceMatrizEstafeta;
        // let estOB:any= {}
        // estOB[estfetaService] = matrizEstafeta 
        // const DHLService = serviceMatrizDHL;
        // const matrizPayload = { "Estafeta": { estfetaService: matrizEstafeta }, "DHL": { serviceMatrizDHL: matrizEstafeta } }

        const payloadMatriz = {
            "Estafeta": {
                "Dia Sig.": [],
                "Terrestre": []
            },
            "DHL": {
                "N": [],
                "G": []
            }
        }
        switch (serviceMatrizDHL[0]?.value) {
            case "G":
                payloadMatriz.DHL.G = matrizDHL
                break;
            case "N":
                payloadMatriz.DHL.N = matrizDHL
                break;
            default:
                alert("No se identifica el servicio a guardar")
        }
        switch (serviceMatrizEstafeta[0]?.value) {
            case "Dia Sig.":
                payloadMatriz.Estafeta['Dia Sig.'] = matrizEstafeta
                break;
            case "Terrestre":
                payloadMatriz.Estafeta['Terrestre'] = matrizEstafeta
                break;
            default:
                alert("No se identifica el servicio a guardar")
        }
        fetch(URLlogin, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'true',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "idServices": result,
                "referencia": userName,
                "matriz": payloadMatriz

            })
        })
            .then(res => {
                console.log('response', res)
                return res.json();

            })
            .then((data) => {
                console.log('mensaje del servidor: ', data)
                if (data.data === false || data.data === 'data' || data.data === null) {
                    console.log("ERROR: datos no guardados")
                } else {
                    console.log("datos guardados")
                }


            })
    }

    React.useEffect(() => {
        if (userName === "") {
            setUserName(dataUser.referencia)
        }
        if (matrizDHL.length <= 0) {
            setMatrizDHL(StaticData.defaultDatosTabla)
        }
        if (matrizEstafeta.length <= 0) {
            setMatrizEstafeta(StaticData.defaultDatosTabla)
        }
    }, [])
    return (
        <Card>
            <DisplaySmall>
                {StaticData.copys.basic_info_form_title}
            </DisplaySmall>
            <FormControl
                label={() => `${StaticData.copys.username_input_label}`}
                caption={() => `${StaticData.copys.username_input_caption}`}
            >
                <Input value={userName}
                    onChange={event => setUserName(event.currentTarget.value)}
                    clearable />
            </FormControl>
            <DisplaySmall>
                {`${StaticData.copys.data_sheet} ${StaticData.copys.currier_Est}`}
            </DisplaySmall>
            <Select
                overrides={Styles.SelectOverrides}
                options={StaticData.optionsServicesEstafeta}
                value={serviceMatrizEstafeta}
                placeholder={StaticData.copys.services_select_placeholder}
                onChange={params => handleChangeServicesEstafeta(params)}
            />
            <Spreadsheet data={matrizEstafeta.length > 0 ? matrizEstafeta : StaticData.defaultDatosTabla} onChange={setMatrizEstafeta} />
            <DisplaySmall>
                {`${StaticData.copys.data_sheet} ${StaticData.copys.currier_DHL}`}
            </DisplaySmall>
            <Select
                overrides={Styles.SelectOverrides}
                options={StaticData.optionsServicesDHL}
                value={serviceMatrizDHL}
                placeholder={StaticData.copys.services_select_placeholder}
                onChange={params => handleChangeServicesDHL(params)}
            />
            <Spreadsheet data={matrizDHL.length>0? matrizDHL : StaticData.defaultDatosTabla} onChange={setMatrizDHL} />
            <Button onClick={() => handleSubmitButton()}>
                Continuar
            </Button>
        </Card>
    )
}

export default EditUserForm;