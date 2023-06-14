import { styled } from "baseui"

export const LoginContainerCardStyle = styled("div", () => ({
    backgroundSize: "cover",
    position: "absolute",
    width: "60%",
    height: "50%",
    top: "25%",
    left: "20%",

}))

export const CardOverrides = {
    Body: {
        style: () => ({
            height: "50vh",
            alignItems: "center",
            display:"flex",
            justifyContent:"center",
            width: "100%"
        })
    }
}

export const GridOverrides = {
    Grid: {
        style: () => ({
            width: "60%",
            rowGap: "3em",
            display:"contents",
            justifyContent:"center"
        })
    }
}

export const ButtonOverrides = {
    BaseButton: {
        style: () => ({
            backgroundColor: "#33FFD4",
            color: "#2A5CAA",
            justifyContent: "center"
        })
    }
}
