import { FC, ReactNode } from 'react';
import Providers from '../providers';
interface LayoutProps {
    children?: ReactNode;
}

const ConvertLayout: FC<LayoutProps> = (props) => {

    return (<Providers>{props.children}</Providers>)
}
export default ConvertLayout;