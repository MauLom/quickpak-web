import * as React from 'react';
import { Button } from 'baseui/button';
import { useStyletron } from 'baseui';
import { OrangeCircle, BlueCirlce } from "../styles.js"
import LoginContainer from '../containers/login/index';

export const sum = (a: number, b: number) => a + b;

const Index: React.FC = () => {
  const [css, theme] = useStyletron();
  return (
    <div>
      <OrangeCircle />
      <BlueCirlce />
      <LoginContainer />
    </div>
  );
};

export default Index;
