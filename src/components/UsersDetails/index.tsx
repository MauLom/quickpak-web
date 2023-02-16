import React, { useEffect, useState } from 'react';
import { withStyle } from 'baseui';
import { Block } from 'baseui/block';
import { Button } from "baseui/button";
import { Plus, Delete } from 'baseui/icon';
import {
    StyledTable,
    StyledHead,
    StyledHeadCell,
    StyledBody,
    StyledRow,
    StyledCell,
    StyledAction,
} from 'baseui/table';
import { ParagraphXSmall, ParagraphSmall } from 'baseui/typography';
import EditUserForm from '../EditUserForm';
import { formatDataTableUsers, getDataUsers } from '../../utils/utilities';

const StyledHeadingCell = withStyle(StyledCell, {
    paddingTop: 0,
    paddingBottom: 0,
});


const UsersDetails = () => {
    const [showUserDetail, setShowUserDetail] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [rawUsersData, setRawUsersData] = useState(undefined)
    const [dataTableUsers, setDataTableUsers] = useState([])
    const handlePlusAction = (rowData) => {
        setSelectedUser(rawUsersData.find(element => element.idServices == rowData[1]))
        setShowUserDetail(true)
    }

    const handleAddUserAction = () => {
        setShowUserDetail(true)
    }
    useEffect(() => {
        if (undefined === rawUsersData) {
            getDataUsers().then(data => {
                setRawUsersData(data)
                setDataTableUsers(formatDataTableUsers(data))
            })

        }
    })

    return (
        <div >
            <Button onClick={() => { handleAddUserAction() }}> Agregar cliente </Button>
            <StyledTable>
                <StyledHead >
                    <StyledHeadCell>Nombre</StyledHeadCell>
                    <StyledHeadCell>Id</StyledHeadCell>
                    <StyledHeadCell>Actions</StyledHeadCell>
                </StyledHead>
                <StyledBody>
                    {dataTableUsers.map((row, index) => (
                        <StyledRow key={index}>
                            <StyledCell>{row[0]}</StyledCell>
                            <StyledHeadingCell>
                                <Block>
                                    <ParagraphXSmall>{row[2]}</ParagraphXSmall>
                                    <ParagraphSmall as="div">{row[1]}</ParagraphSmall>
                                </Block>
                            </StyledHeadingCell>
                            <StyledCell>
                                <StyledAction onClick={() => handlePlusAction(row)}>
                                    <Plus />
                                </StyledAction>
                                <StyledAction>
                                    <Delete />
                                </StyledAction>

                            </StyledCell>
                        </StyledRow>
                    ))}
                </StyledBody>
            </StyledTable>
            {showUserDetail && (
                <EditUserForm dataUser={selectedUser} changeUserData={setSelectedUser} />
            )}
        </div>
    )
}

export default UsersDetails;