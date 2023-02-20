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

    const handleChangeServicesId = (newId) =>{
        setServicesId(newId)
    }

    const handleChangeUserName = (newUserName) =>{
        setUserName(newUserName)
    }

    return (
        <UserCtx.Provider
            value={{
                servicesId,
                handleChangeServicesId,
                userName,
                handleChangeUserName
            }}
        >
            {children}
        </UserCtx.Provider>
    )

})