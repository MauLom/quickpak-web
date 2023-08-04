
import { FC, ReactNode } from 'react';
import Providers from '../providers';
interface LayoutProps {
    children?: ReactNode;
}

const DashboardLayout: FC<LayoutProps> = (props) => {

    return (<Providers>{props.children}</Providers>)
}
export default DashboardLayout;