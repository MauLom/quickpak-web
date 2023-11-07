'use client'
// pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { setCookie } from '../lib/manageUserSession'
import { FormControl, FormLabel, Input, Grid, GridItem, Button, Box} from "@chakra-ui/react"
const URL = process.env.NEXT_PUBLIC_API_URL

const Login = () => {
   

    return (
      <div>
        Login 
      </div>
    );
};

export default Login;
