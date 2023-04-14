import * as React from 'react';
import { Input } from "baseui/input"
import { Button, SHAPE } from 'baseui/button';
import { FormControl } from "baseui/form-control";
import * as Style from "./styles"
import { Grid, Cell } from 'baseui/layout-grid';
import { HeadingMedium } from 'baseui/typography';
import { Card } from 'baseui/card';
import { DatePicker } from "baseui/datepicker";
import { Plus } from 'baseui/icon';
const QuoterForm = ({ submitAction, dateValue, changeDateValue }) => {
    const [piecesArr, setPiecesArr] = React.useState([])

    const handleMultipieces = () => {
        console.log("this is happening")
        setPiecesArr([...piecesArr, []])
    }

    return (
        <Style.QuotesFormStyle onSubmit={submitAction}>
            <Card>
                <HeadingMedium>Informacion de envio</HeadingMedium>
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
                            <Input name="origin_zip" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>
                            <Input name="origin_city" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Codigo postal de destino"}
                            caption={() => "codigo postal destino del envio"}>
                            <Input name="destiny_zip" />
                        </FormControl>
                    </Cell>
                    <Cell span={2}>
                        <FormControl
                            label={() => "Ciudad de origen"}
                            caption={() => "Seleccione una de la lista"}>
                            <Input name="destiny_city" />
                        </FormControl>
                    </Cell>
                </Grid>
                <Card>
                    <HeadingMedium>Informacion de paquete(s)</HeadingMedium>
                    <Grid>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Peso"}
                                caption={() => "fecha de envio del paquete"}>
                                <Input name="weight" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Alto"}
                                caption={() => "codigo postal origen del envio"}>
                                <Input name="height" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Ancho"}
                                caption={() => "Seleccione una de la lista"}>
                                <Input name="width" />
                            </FormControl>
                        </Cell>
                        <Cell span={2}>
                            <FormControl
                                label={() => "Profundidad"}
                                caption={() => "codigo postal destino del envio"}>
                                <Input name="lenght" />
                            </FormControl>
                        </Cell>
                    </Grid>
                    {piecesArr.length > 1 &&
                        (
                            <Grid>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Peso"}
                                        caption={() => "fecha de envio del paquete"}>
                                        <Input name="weight2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Alto"}
                                        caption={() => "codigo postal origen del envio"}>
                                        <Input name="height2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Ancho"}
                                        caption={() => "Seleccione una de la lista"}>
                                        <Input name="width2" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Profundidad"}
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
                                        label={() => "Peso"}
                                        caption={() => "fecha de envio del paquete"}>
                                        <Input name="weight3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Alto"}
                                        caption={() => "codigo postal origen del envio"}>
                                        <Input name="height3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Ancho"}
                                        caption={() => "Seleccione una de la lista"}>
                                        <Input name="width3" />
                                    </FormControl>
                                </Cell>
                                <Cell span={2}>
                                    <FormControl
                                        label={() => "Profundidad"}
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
            <Button type="submit"  >Submit</Button>
        </Style.QuotesFormStyle>


    )
}

export default QuoterForm;