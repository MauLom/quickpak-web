import AdminDashboardContainer from "../../containers/adminDashboard"
import { UserContextProvider } from "../../context/userContext"
import { OrangeCircle, BlueCirlce } from "../../styles"
const AdminDashboard = () => {
    return (
        <>
            <OrangeCircle />
            <BlueCirlce />
            <AdminDashboardContainer />
        </>
    )
}

export default AdminDashboard