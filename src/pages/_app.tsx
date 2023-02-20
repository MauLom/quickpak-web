import React from 'react';
import App from 'next/app';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { styletron } from '../styletron';
import { UserContextProvider } from '../context/userContext';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StyletronProvider value={styletron}>
        <BaseProvider theme={LightTheme}>
          <UserContextProvider srvcsId={"onApp1"} usrName={"onApp2"}>
            <Component {...pageProps} />
          </UserContextProvider>
        </BaseProvider>
      </StyletronProvider>
    );
  }
}
