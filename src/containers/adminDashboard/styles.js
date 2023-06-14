import { styled } from "baseui"

export const PaginationOverrides = {
    PrevButton:{
        style: () =>({
            zIndex:3
        })
    },
    NextButton:{
        style: () =>({
            zIndex:2
        })
    }
}
export const headerOverrides ={
    Grid: {
        style: ()  => ({
            backgroundColor: "#1055d5",
            width:"100%",
            height: "50px",
            justifyContent: "end",
            
        })
    }
}