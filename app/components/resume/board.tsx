import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'

const ResumeBoard = () => {

    return (
        <>
            <StatGroup>
                <Stat>
                    <StatLabel>Usuarios activos</StatLabel>
                    <StatNumber>349</StatNumber>
                    <StatHelpText>
                        <StatArrow type='increase' />
                        23.36%
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Guias generadas</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                        <StatArrow type='decrease' />
                        9.05%
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Cotizaciones realizadas</StatLabel>
                    <StatNumber>250</StatNumber>
                    <StatHelpText>
                        <StatArrow type='decrease' />
                        5.05%
                    </StatHelpText>
                </Stat>
                {/* <Stat>
                    <StatLabel>Guias generadas</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                        <StatArrow type='decrease' />
                        9.05%
                    </StatHelpText>
                </Stat> */}
            </StatGroup>
        </>
    )

}

export default ResumeBoard