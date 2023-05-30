import * as React from 'react';
import { Input } from "baseui/input"
import { Button, SHAPE } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalButton } from 'baseui/modal';
import * as Style from "./styles"
import { Grid, Cell } from 'baseui/layout-grid';
import { HeadingMedium } from 'baseui/typography';
import { Card } from 'baseui/card';
import { DatePicker } from "baseui/datepicker";
import { Plus } from 'baseui/icon';
import { getCityByZip } from '../../services/generalValues';
import {Checkbox} from 'baseui/checkbox';
const QuoterForm = ({ submitAction, dateValue, changeDateValue, packageparts }) => {
    const [piecesArr, setPiecesArr] = React.useState([])
    const [numpices, setNumpices] = React.useState(1)
    const [cityOrigin, setCityOrigin] = React.useState("A")
    const [cityDestiny, setCityDestiny] = React.useState("B")
    const [isOpen, setIsOpen] = React.useState(false)
    const [checked, setChecked] = React.useState(true)

    const handleMultipieces = () => {
        setPiecesArr([...piecesArr, []])
        setNumpices(numpices + 1)
        packageparts(numpices + 1)
        if (numpices === 1) {
            setIsOpen(true)

        }

        console.log('numero de piezas ', piecesArr.length, 'numero de clicks', numpices)
    }

    const getCPInfo = (option, event) => {

        const zip = event.target.value
        console.log("option", option)
        console.log("zip", zip)
        console.log("zip L ", zip.length)
        if (zip.length == 5) {
            // const URL = `https://api.copomex.com/query/info_cp/${zip}?type=simplified&token=6a5d6f1f-2f9e-4f43-8e1a-c94b85afb236`
            const URL = `https://app.zipcodebase.com/api/v1/search?apikey=4fbea6d0-a146-11ec-9995-574998514919&codes=${zip}&country=MX`
            getCityByZip(URL)
                .then(data => {
                    switch (option) {
                        case "o":
                            setCityOrigin(data.data.results[zip][0].province)
                            break;
                        case "d":
                            setCityDestiny(data.data.results[zip][0].province)
                            break;

                    }
                })
        }

    }
    const close = () => {
        setIsOpen(false)
    }

    return (
        <Style.QuotesFormStyle onSubmit={submitAction}>
            <Card>
                <Modal onClose={close} isOpen={isOpen}>
                    <ModalHeader>Attention</ModalHeader>
                    <ModalBody>
                        It is not possible to make a quote in Estafeta if there are multiple pieces.
                    </ModalBody>
                    <ModalFooter>
                        <ModalButton onClick={close}>Okay</ModalButton>
                    </ModalFooter>
                </Modal>
                <HeadingMedium>Información de envio</HeadingMedium>
                <Grid >
                    <Cell span={2}>
                        <FormControl
                            label={() => "Fecha"}
                            caption={() => "fecha de envio del paquete"}>
                            <DatePicker
                                value={dateValue}
                                formatString="yyyy-MM-dd"
                                onChange={({ date }) =>
                                    changeDateValue(Array.isArray(date) ? date : [date])
                                }
                            />
                            {/* <Input name="date" /> */}
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Codigo postal de origen"}
                            caption={() => "codigo postal origen del envio"}>
                            <Input name="origin_zip" onChange={(e) => { getCPInfo("o", e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>

                            <Input name="origin_city" value={cityOrigin} />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Codigo postal de destino"}
                            caption={() => "codigo postal destino del envio"}>
                            <Input name="destiny_zip" onChange={(e) => { getCPInfo("d", e) }} />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>
                            <Input name="destiny_city" value={cityDestiny} />
                        </FormControl>
                    </Cell>
                </Grid>
                <Card>
                    <HeadingMedium>Descripción del embalaje</HeadingMedium>
                    <Grid>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Peso      (Kg)"}
                                caption={() => "fecha de envio del paquete"}>
                                <Input name="weight" />
                            </FormControl>
                            
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Alto (cm)"}
                                caption={() => "codigo postal origen del envio"}>
                                <Input name="height" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Ancho (cm)"}
                                caption={() => "Seleccione una de la lista"}>
                                <Input name="width" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Profundidad (cm)"}
                                caption={() => "codigo postal destino del envio"}>
                                <Input name="lenght" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <Checkbox
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                            >
                                Agregar seguro
                            </Checkbox>
                            </Cell>
                            {checked === true &&(
                            <Cell span={2}>   
                            <FormControl
                                label={() => "Monto"}
                                caption={() => "monto  de seguro"}>
                                <Input type='number' name="amount" />
                            </FormControl>
                        </Cell>
                        )}
                    </Grid>
                    {piecesArr.length > 1 &&
                        (
                            <Grid>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Peso   (Kg)"}
                                        caption={() => "fecha de envio del paquete"}>
                                        <Input name="weight2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Alto  (cm)"}
                                        caption={() => "codigo postal origen del envio"}>
                                        <Input name="height2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Ancho  (cm)"}
                                        caption={() => "Seleccione una de la lista"}>
                                        <Input name="width2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Profundidad  (cm)"}
                                        caption={() => "codigo postal destino del envio"}>
                                        <Input name="lenght2" />
                                    </FormControl>
                                </Cell>
                                
                            </Grid>
                        )}
                    {piecesArr.length >= 2 &&
                        (
                            <Grid>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Peso   (Kg)"}
                                        caption={() => "fecha de envio del paquete"}>
                                        <Input name="weight3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Alto  (cm)"}
                                        caption={() => "codigo postal origen del envio"}>
                                        <Input name="height3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Ancho  (cm)"}
                                        caption={() => "Seleccione una de la lista"}>
                                        <Input name="width3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Profundidad  (cm)"}
                                        caption={() => "codigo postal destino del envio"}>
                                        <Input name="lenght3" />
                                    </FormControl>
                                </Cell>
                                
                            </Grid>
                        )}
                    {piecesArr.length < 2 && (
                        <Cell span={2}>
                            <Button type="button" shape={SHAPE.circle} onClick={() => { handleMultipieces() }}>
                                <Plus />
                            </Button>
                        </Cell>
                    )}
                </Card>
            </Card>
            <Button type="submit"  >Cotizar</Button>
        </Style.QuotesFormStyle>


    )
}

export default QuoterForm;