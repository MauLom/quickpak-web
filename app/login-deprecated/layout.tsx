import { FC, ReactNode } from 'react';
import Providers from '../providers';

interface LayoutProps {
    children?: ReactNode;
}


const LoginLayout: FC<LayoutProps> = (props) => {
    return (<Providers>{props.children}</Providers>)
}

export default LoginLayout