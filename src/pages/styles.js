import { styled } from "baseui"

export const OrangeCircle = styled("div", () => ({
  position: "absolute",
  width: "575px",
  height: "575px",
  bottom: "10px",
  right: "10px",
  background: " rgba(255, 219, 150, 0.5)",
  borderRadius: "50%",
  backdropFilter: "blur(50px)",
  zIndex: 0
}))
export const BlueCirlce = styled("div", () => ({
  position: "absolute",
  width: "575px",
  height: "575px",
  left: "10px",
  top: "10px",
  background: " rgba(54, 146, 231, 0.2)",
  borderRadius: "50%",
  zIndex: 0
}))

export const ButtonBaseOverride = {
  BaseButton: {
    style: () => ({
      backgroundColor: "red !important"
    })
  }
}
