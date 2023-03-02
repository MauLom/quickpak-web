import * as React from 'react'
import { UserInterface } from '../utils/interfaces/userInterface'
export const UserCtx = React.createContext<UserInterface>({})

export const UserContextProvider = (({
    children,
    srvcsId,
    usrName
})=>{
    const [servicesId, setServicesId] = React.useState(srvcsId)
    const [userName, setUserName] = React.useState(usrName)
    const [rateData, setRateData] = React.useState({})
    const [serviceProvider, setServiceProvider] = React.useState("")
    const [serviceType, setServiceType] = React.useState("")

    const handleChangeServicesId = (newId) =>{
        setServicesId(newId)
    }

    const handleChangeUserName = (newUserName) =>{
        setUserName(newUserName)
    }

    const handleChangeRateData = (dataObj) =>{
        setRateData(dataObj)
    }
    const handleChangeServiceProvider = (newServiceProvider) =>{
        setServiceProvider(newServiceProvider)
    }
    const handleChangeServiceType = (newServiceType) =>{
        setServiceType(newServiceType)
    }

    return (
        <UserCtx.Provider
            value={{
                servicesId,
                handleChangeServicesId,
                userName,
                handleChangeUserName,
                rateData,
                handleChangeRateData,
                serviceProvider,
                handleChangeServiceProvider,
                serviceType,
                handleChangeServiceType
            }}
        >
            {children}
        </UserCtx.Provider>
    )

})