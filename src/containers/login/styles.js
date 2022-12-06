import { styled } from "baseui"

export const LoginContainerCardStyle = styled("div", () => ({
    backgroundSize: "cover",
    position: "absolute",
    width:"60%",
    height:"50%",
    top: "25%",
    left: "20%"
  }))
  
export const CardOverrides = {
    Body: {
        style: () => ({
            height:"50vh"
        })
    }
}